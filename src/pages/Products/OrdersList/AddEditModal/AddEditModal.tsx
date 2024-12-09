import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, DatePicker, Form, InputNumber, Modal, Select, Spin, notification } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { IUpdateUser, clientsInfoApi } from '@/api/clients';
import { ordersStore, productsListStore } from '@/stores/products';
import { supplierInfoStore } from '@/stores/supplier';
import styles from '../orders.scss';
import { priceFormat } from '@/utils/priceFormat';
import { PlusOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/Datatable/datatable';
import { addOrderProductsColumns } from './constants';
import { useMediaQuery } from '@/utils/mediaQuery';
import dayjs from 'dayjs';
import { clientsInfoStore } from '@/stores/clients';
import { ordersApi } from '@/api/order';
import { IAddOrder, IAddOrderModalForm, IAddOrderProducts } from '@/api/order/types';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const [formProduct] = Form.useForm();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isAcceptedOrder, setIsAcceptedOrder] = useState(false);

  // GET DATAS
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchClients],
    queryFn: () =>
      clientsInfoStore.getClients({
        pageNumber: 1,
        pageSize: 15,
        search: searchClients!,
      }),
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['getProducts', searchProducts],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: 1,
        pageSize: 15,
        search: searchProducts!,
      }),
  });

  const { mutate: createNewOrder } =
    useMutation({
      mutationKey: ['createNewOrder'],
      mutationFn: (params: IAddOrder) => ordersApi.addNewOrder(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const { mutate: updateOrder } =
    useMutation({
      mutationKey: ['updateOrder'],
      mutationFn: (params: IUpdateUser) => clientsInfoApi.updateUser(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  // SUBMIT FORMS
  const handleCloseUnAcceptedOrder = () => {
    setIsAcceptedOrder(false);
    form.submit();
  };

  const handleCloseAcceptedOrder = () => {
    setIsAcceptedOrder(true);
    form.submit();
  };

  const handleSubmitProductModal = () => {
    formProduct.submit();
  };

  const handleSubmit = (values: IAddOrderModalForm) => {
    if (ordersStore.addOrderProducts?.length === 0) {
      notification.error({
        message: 'Mahsulot qo\'shing!',
        placement: 'topRight',
      });

      return;
    }

    const valueControl: IAddOrder = {
      clientId: values?.clientId,
      sum: 100,
      payment: {
        card: values?.card,
        cash: values?.cash,
        transfer: values?.transfer,
        other: values?.other,
      },
      accepted: isAcceptedOrder,
      createdAt: values?.createdAt,
      products: ordersStore.addOrderProducts,
    };

    if (ordersStore?.singleOrder) {
      // UPDATE LOGIC

      return;
    }

    createNewOrder(valueControl);
  };

  const handleSubmitProduct = (values: IAddOrderProducts) => {
    const findProduct = productsData?.data?.find(product => product?.id === values?.product_id);

    if (!findProduct) {
      notification.error({
        message: 'Mahsulot topilmadi!',
        placement: 'topRight',
      });

      return;
    }

    const newOrderProduct: IAddOrderProducts = {
      ...values,
      cost: findProduct?.cost,
      avarage_cost: findProduct?.avarage_cost,
      product_name: findProduct?.name,
    };

    ordersStore.setAddOrderProducts([
      ...ordersStore.addOrderProducts,
      newOrderProduct,
    ]);

    formProduct.resetFields();
  };

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setIsOpenAddEditNewOrderModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchSupplier = (value: string) => {
    setSearchClients(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.find(product => product?.id === productId);

    formProduct.setFieldValue('price', findProduct?.cost);
  };

  const supplierOptions = useMemo(() => (
    clientsData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (ordersStore.singleOrder) {
      form.setFieldsValue({
        ...ordersStore.singleOrder,
      });
    }
  }, [ordersStore.singleOrder]);

  // Esc Key Listener
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      console.log('Salom');
      if (event.key === 'Escape') {
        handleCloseUnAcceptedOrder();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);


  const countColor = (count: number, min_amount: number): string =>
    count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

  return (
    <Modal
      open={ordersStore.isOpenAddEditNewOrderModal}
      title={ordersStore.singleOrder ? 'Sotuvni tahrirlash' : 'Yangi sotuv'}
      onCancel={handleModalClose}
      okText={ordersStore.singleOrder ? 'Tushurilgan mahsulotni tahrirlash' : 'Yangi mahsulot tushurish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
      width={900}
      footer={
        <div>
          <Button
            type="primary"
            style={{ backgroundColor: 'orange' }}
            onClick={handleCloseUnAcceptedOrder}
          >
            Tasdiqlamasdan yopish
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: 'green' }}
            onClick={handleCloseAcceptedOrder}
          >
            Tasdiqlab yopish
          </Button>
        </div>
      }
    >
      {/* PRODUCTS FORM */}
      <Form
        form={formProduct}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="income-order__add-products-form"
      >
        <Form.Item
          label="Mahsulot"
          rules={[{ required: true }]}
          name="product_id"
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            loading={loadingProducts}
            optionFilterProp="children"
            notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchProducts}
            onChange={handleChangeProduct}
            optionLabelProp="label"
          >
            {productsData?.data.map((product) => (
              <Select.Option
                key={product?.id}
                value={product?.id}
                label={product?.name}
                className={cn('income-order__add-product')}
              >
                <div className={cn('income-order__add-product-option')}>
                  <p className={cn('income-order__add-product-name')}>
                    {product?.name}
                  </p>
                  <div className={cn('income-order__add-product-info')}>
                    <p className={cn('income-order__add-product-price')}>
                      {product?.selling_price}$
                    </p>
                    <p
                      style={{ backgroundColor: `${countColor(product?.count, product?.min_amount)}` }}
                      className={cn('income-order__add-product-count')}
                    >
                      {product?.count} dona
                    </p>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Narxi"
          rules={[{ required: true }]}
          name="price"
          initialValue={0}
        >
          <InputNumber
            placeholder="Sotib olingan narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Tushuriladigan mahsulot sonini kiriting"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Button
          onClick={handleSubmitProductModal}
          type="primary"
          icon={<PlusOutlined />}
        >
          Qo&apos;shish
        </Button>
      </Form>

      {/* PRODUCTS SHOW LIST */}
      <DataTable
        columns={addOrderProductsColumns}
        data={ordersStore?.addOrderProducts || []}
        isMobile={isMobile}
        pagination={false}
        scroll={{ y: 300 }}
      />

      <div className="income-order__add-products-form-pay-info">
        <Alert type="info" message={`Umumiy narx: ${100}$`} />
        <Alert type="error" message={`Qarzga: ${100}$`} />
        <Alert type="warning" message={`Qaytim: ${100}$`} />
      </div>

      {/* ORDER OTHER INFO */}
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
        className="income-order__add-products-form-info"
      >
        <Form.Item
          label="Mijoz"
          rules={[{ required: true }]}
          name="clientId"
        >
          <Select
            showSearch
            placeholder="Mijoz"
            loading={loadingClients}
            optionFilterProp="children"
            notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchSupplier}
            options={supplierOptions}
          />
        </Form.Item>
        <Form.Item
          label="Tushurish sanasi"
          rules={[{ required: true }]}
          name="createdAt"
          initialValue={dayjs()}
        >
          <DatePicker
            defaultValue={dayjs()}
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          rules={[{ required: true }]}
          name="cash"
          initialValue={0}
        >
          <InputNumber
            placeholder="Naqd to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Bank kartasi orqali to'lov"
          rules={[{ required: true }]}
          name="card"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Bank o'tkazmasi orqali to'lov"
          rules={[{ required: true }]}
          name="transfer"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank o'tkazmasi orqali to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Boshqa usullar bilan to'lov"
          rules={[{ required: true }]}
          name="other"
          initialValue={0}
        >
          <InputNumber
            placeholder="Boshqa usullar bilan to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
