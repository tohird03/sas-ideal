import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Modal, Select, Spin } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { IAddClientInfo, IUpdateUser, clientsInfoApi } from '@/api/clients';
import { incomeProductsStore, productsListStore } from '@/stores/products';
import { supplierInfoStore } from '@/stores/supplier';
import styles from '../income-products.scss';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchSupplierOption, setSearchSupplierOption] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);

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

  const { mutate: createNewProduct } =
    useMutation({
      mutationKey: ['createNewProduct'],
      mutationFn: (params: IAddClientInfo) => clientsInfoApi.addSupplier(params),
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

  const handleSubmit = (values: IAddClientInfo) => {
    const valueControl = {
      ...values,
      phone: `998${values?.phone}`,
    };

    setLoading(true);

    if (incomeProductsStore?.singleIncomeOrder) {
      updateOrder({
        ...valueControl,
        id: incomeProductsStore?.singleIncomeOrder?.id!,
      });

      return;
    }
    createNewProduct(valueControl);
  };

  const handleModalClose = () => {
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSearchSupplier = (value: string) => {
    setSearchSupplierOption(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
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
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="providerId"
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
          label="Mahsulot"
          rules={[{ required: true }]}
          name="productId"
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            loading={loadingProducts}
            optionFilterProp="children"
            notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchProducts}
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
                      style={{backgroundColor: `${countColor(product?.count, product?.min_amount)}`}}
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
      </Form>
    </Modal>
  );
});
