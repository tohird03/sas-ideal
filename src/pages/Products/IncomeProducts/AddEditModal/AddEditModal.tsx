import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, DatePicker, Form, InputNumber, Modal, Select, Spin, notification } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { IAddClientInfo, IUpdateUser, clientsInfoApi } from '@/api/clients';
import { incomeProductsStore, productsListStore } from '@/stores/products';
import { supplierInfoStore } from '@/stores/supplier';
import styles from '../income-products.scss';
import { priceFormat } from '@/utils/priceFormat';
import { IAddEditIncomeOrder, IAddIncomeOrderForm, IAddIncomeOrderProducts } from '@/api/income-products/types';
import { PlusOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/Datatable/datatable';
import { addIncomeOrderProductsColumns } from './constants';
import { useMediaQuery } from '@/utils/mediaQuery';
import { incomeProductsApi } from '@/api/income-products';
import dayjs from 'dayjs';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const [formProduct] = Form.useForm();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [searchSupplierOption, setSearchSupplierOption] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);

  // GET DATAS
  const { data: supplierData, isLoading: loadingSupplier } = useQuery({
    queryKey: ['getSuppliers', searchSupplierOption],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: 1,
        pageSize: 15,
        search: searchSupplierOption!,
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

  const { mutate: createNewIncomeOrder } =
    useMutation({
      mutationKey: ['createNewIncomeOrder'],
      mutationFn: (params: IAddEditIncomeOrder) => incomeProductsApi.addNewIncomeOrder(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
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
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  // SUBMIT FORMS
  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmitProductModal = () => {
    formProduct.submit();
  };

  const handleSubmit = (values: IAddIncomeOrderForm) => {
    if (incomeProductsStore.addIncomeProducts?.length === 0) {
      notification.error({
        message: 'Mahsulot qo\'shing!',
        placement: 'topRight',
      });

      return;
    }

    const valueControl: IAddEditIncomeOrder = {
      supplierId: values?.supplierId,
      sum: 100,
      payment: {
        card: values?.card,
        cash: values?.cash,
        transfer: values?.transfer,
        other: values?.other,
      },
      createdAt: values?.createdAt,
      products: incomeProductsStore.addIncomeProducts,
    };

    if (incomeProductsStore?.singleIncomeOrder) {
      // UPDATE LOGIC

      return;
    }

    createNewIncomeOrder(valueControl);
  };

  const handleSubmitProduct = (values: IAddIncomeOrderProducts) => {
    const findProduct = productsData?.data?.find(product => product?.id === values?.product_id);

    const newOrderProduct: IAddIncomeOrderProducts = {
      ...values,
      product_name: findProduct?.name!,
    };

    incomeProductsStore.setAddIncomeProducts([
      ...incomeProductsStore.addIncomeProducts,
      newOrderProduct,
    ]);

    formProduct.resetFields();
  };

  const handleModalClose = () => {
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchSupplier = (value: string) => {
    setSearchSupplierOption(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.find(product => product?.id === productId);

    formProduct.setFieldValue('cost', findProduct?.cost);
  };

  const supplierOptions = useMemo(() => (
    supplierData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}: +${supplier?.phone}`,
    }))
  ), [supplierData]);

  useEffect(() => {
    if (incomeProductsStore.singleIncomeOrder) {
      form.setFieldsValue({
        ...incomeProductsStore.singleIncomeOrder,
      });
    }
  }, [incomeProductsStore.singleIncomeOrder]);

  const countColor = (count: number, min_amount: number): string =>
    count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

  return (
    <Modal
      open={incomeProductsStore.isOpenAddEditIncomeProductsModal}
      title={incomeProductsStore.singleIncomeOrder ? 'Tushurilgan mahsulotni tahrirlash' : 'Yangi mahsulot tushurish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={incomeProductsStore.singleIncomeOrder ? 'Tushurilgan mahsulotni tahrirlash' : 'Yangi mahsulot tushurish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
      width={900}
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
          label="Sotib olingan narxi"
          rules={[{ required: true }]}
          name="cost"
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
        columns={addIncomeOrderProductsColumns}
        data={incomeProductsStore?.addIncomeProducts || []}
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
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="supplierId"
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            loading={loadingSupplier}
            optionFilterProp="children"
            notFoundContent={loadingSupplier ? <Spin style={{ margin: '10px' }} /> : null}
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
