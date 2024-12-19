import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Spin, Tag } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { ordersStore, productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/Datatable/datatable';
import { useMediaQuery } from '@/utils/mediaQuery';
import dayjs from 'dayjs';
import { clientsInfoStore } from '@/stores/clients';
import { ordersApi } from '@/api/order';
import styles from '../orders.scss';
import {
  IAddOrder,
  IAddOrderModalForm,
  IAddOrderProducts,
  IOrderProductAdd,
  IOrderProducts,
} from '@/api/order/types';
import { ColumnType } from 'antd/es/table';
import { OrderStatus, OrderStatusColor } from '../constants';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<IOrderProducts | null>(null);

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

  const handleOpenPaymentModal = () => {
    ordersStore.setIsOpenPaymentModal(true);
  };

  // SUBMIT FORMS
  const handleSaveUnAccepted = () => {
    // TODO
  };

  const handleSaveAccepted = () => {
    // TODO
  };

  const handleCreateOrUpdateOrder = () => {
    form.submit();
  };

  const handleSubmitProduct = (values: IAddOrderModalForm) => {
    setLoading(true);

    const addProducts: IAddOrderProducts = {
      product_id: values?.product_id,
      count: values?.count,
      price: values?.price,
    };

    if (ordersStore?.order) {
      const addOrderProduct: IOrderProductAdd = {
        ...addProducts,
        order_id: ordersStore?.order?.id,
      };

      ordersApi.orderProductAdd(addOrderProduct)
        .then(() => {
          form.resetFields(['product_id', 'price', 'count']);
          ordersStore.getSingleOrder(ordersStore.order?.id!)
            .finally(() => {
              setLoading(false);
            });
        })
        .catch(addNotification);

      return;
    }

    const createOrderData: IAddOrder = {
      clientId: values?.clientId,
      createdAt: values?.createdAt,
      products: [addProducts],
    };

    ordersApi.addNewOrder(createOrderData)
      .then(res => {
        form.resetFields(['product_id', 'price', 'count']);
        if (res?.id) {
          ordersStore.getSingleOrder(res?.id!)
            .finally(() => {
              setLoading(false);
            });
        } else {
          ordersStore.setOrder(res);
        }
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      })
      .catch(addNotification);
  };

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setOrder(null);
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

    form.setFieldValue('price', findProduct?.selling_price);
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  const supplierOptions = useMemo(() => (
    clientsData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (ordersStore.singleOrder && ordersStore?.order) {
      setSearchClients(ordersStore?.order?.client?.phone);

      form.setFieldsValue({
        cash: ordersStore.order?.payment?.cash,
        card: ordersStore.order?.payment?.card,
        transfer: ordersStore.order?.payment?.transfer,
        other: ordersStore.order?.payment?.other,
        createdAt: dayjs(ordersStore.order?.createdAt),
        clientId: ordersStore?.order?.client?.id,
      });
    }
  }, [ordersStore.order]);

  const countColor = (count: number, min_amount: number): string =>
    count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

  // TABLE ACTIONS
  const handleEditProduct = (orderProduct: IOrderProducts) => {
    setIsUpdatingProduct(orderProduct);
  };

  const handleDeleteProduct = (orderId: string) => {
    ordersApi.deleteOrderProduct(orderId)
      .then(() => {
        ordersStore.getSingleOrder(ordersStore.order?.id!)
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(addNotification);
  };

  const handleChangePrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, price: value || 0 });
  };

  const handleChangeCount = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, count: value || 0 });
  };

  const handleSaveAndUpdateOrderProduct = () => {
    if (isUpdatingProduct) {
      ordersApi.updateOrderProduct({
        id: isUpdatingProduct?.id,
        price: isUpdatingProduct?.price,
        count: isUpdatingProduct?.count,
      })
        .then(res => {
          if (res) {
            ordersStore.getSingleOrder(ordersStore.order?.id!)
              .then(() => {
                setIsUpdatingProduct(null);
              })
              .finally(() => {
                setLoading(false);
              });
            addNotification('Mahsulot muvaffaqiyatli o\'zgartildi!');
          }
        })
        .catch(addNotification);
    }
  };

  const addOrderProductsColumns: ColumnType<IOrderProducts>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'product_name',
      dataIndex: 'product_name',
      title: 'Mahsulot nomi',
      align: 'center',
      render: (value, record) => record?.product?.name,
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: 'Soni',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.count}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangeCount}
          />
        ) : <span>{record?.count}</span>
      ),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Narxi',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.price}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangePrice}
          />
        ) : <span>{record?.price}$</span>
      ),
    },
    {
      key: 'totalCost',
      dataIndex: 'totalCost',
      title: 'Jami narxi',
      align: 'center',
      render: (value, record) => `${record?.price * record?.count}$`,
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Action',
      align: 'center',
      render: (value, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          {isUpdatingProduct?.id === record?.id ? (
            <Button
              onClick={handleSaveAndUpdateOrderProduct}
              type="primary"
              style={{ backgroundColor: 'green' }}
              icon={<CheckOutlined />}
            />
          ) : (
            <Button
              onClick={handleEditProduct.bind(null, record)}
              type="primary"
              icon={<EditOutlined />}
            />
          )
          }
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
            onConfirm={handleDeleteProduct.bind(null, record?.id)}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={ordersStore.isOpenAddEditNewOrderModal}
      title={(
        <div className={cn('order__add-products-header')}>
          {ordersStore.singleOrder ? 'Sotuvni tahrirlash' : 'Yangi sotuv'}
          <div>
            <Tag
              color={OrderStatusColor[String(ordersStore?.order?.accepted)]}
            >
              {OrderStatus[String(ordersStore?.order?.accepted)]}
            </Tag>
            <Button
              type="primary"
              onClick={handleOpenPaymentModal}
            >
              Mijoz to&lsquo;lovi
            </Button>
          </div>
        </div>
      )}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      width={'95%'}
      footer={
        <div>
          {!ordersStore?.order?.accepted && (
            <Button
              type="primary"
              style={{ backgroundColor: '#ff7700' }}
              onClick={handleSaveUnAccepted}
            >
              Tasdiqlamasdan saqlash
            </Button>
          )
          }
          <Button
            type="primary"
            style={{ backgroundColor: 'green' }}
            onClick={handleSaveAccepted}
          >
            Saqlash
          </Button>
        </div>
      }
    >
      {/* PRODUCTS FORM */}
      <Form
        form={form}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="order__add-products-form"
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
            onClear={handleClearClient}
            options={supplierOptions}
            allowClear
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
          label="Mahsulot"
          rules={[{ required: true }]}
          name="product_id"
        >
          <Select
            showSearch
            placeholder="Mahsulot"
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
          onClick={handleCreateOrUpdateOrder}
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
        >
          Qo&apos;shish
        </Button>
      </Form>

      {/* PRODUCTS SHOW LIST */}
      <DataTable
        columns={addOrderProductsColumns}
        data={ordersStore?.order?.products || []}
        isMobile={isMobile}
        pagination={false}
        scroll={{ y: 300 }}
      />

      {/* <div className="income-order__add-products-form-pay-info">
        <Alert type="info" message={`Umumiy narx: ${100}$`} />
        <Alert type="error" message={`Qarzga: ${100}$`} />
        <Alert type="warning" message={`Qaytim: ${100}$`} />
      </div> */}
    </Modal>
  );
});
