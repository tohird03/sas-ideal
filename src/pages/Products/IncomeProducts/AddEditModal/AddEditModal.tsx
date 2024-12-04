import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select, Spin } from 'antd';
import { addNotification } from '@/utils';
import { regexPhoneNumber } from '@/utils/phoneFormat';
import { IAddClientInfo, IUpdateUser, clientsInfoApi } from '@/api/clients';
import { incomeProductsStore } from '@/stores/products';
import { supplierInfoStore } from '@/stores/supplier';

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchSupplierOption, setSearchSupplierOption] = useState<string | null>(null);

  const { data: supplierData, isLoading: loadingSupplier } = useQuery({
    queryKey: ['getSuppliers', searchSupplierOption],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: 1,
        pageSize: 15,
        search: searchSupplierOption!,
      }),
  });


  const { mutate: createNewProduct } =
    useMutation({
      mutationKey: ['createNewProduct'],
      mutationFn: (params: IAddClientInfo) => clientsInfoApi.addSupplier(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getSuppliers'] });
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
        queryClient.invalidateQueries({ queryKey: ['getSuppliers'] });
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

  const supplierOptions = useMemo(() => (
    supplierData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}`,
    }))
  ), [supplierData]);

  useEffect(() => {
    if (incomeProductsStore.singleIncomeOrder) {
      form.setFieldsValue({
        ...incomeProductsStore.singleIncomeOrder,
      });
    }
  }, [incomeProductsStore.singleIncomeOrder]);

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
            notFoundContent={loadingSupplier ? <Spin style={{margin: '10px'}} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchSupplier}
            options={supplierOptions}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefon raqami: 901234567"
          rules={[
            { required: true },
            {
              pattern: regexPhoneNumber,
              message: 'Raqamni to\'g\'ri kiriting!, Masalan: 901234567',
            },
          ]}
        >
          <InputNumber
            addonBefore="+998"
            placeholder="Telefon raqami"
            style={{ width: '100%' }}
            type="number"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
