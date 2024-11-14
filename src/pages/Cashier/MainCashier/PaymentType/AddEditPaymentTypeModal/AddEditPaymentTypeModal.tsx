import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal, Select} from 'antd';
import {AxiosError} from 'axios';
import {paymentTypeApi} from '@/api/paymentType';
import {IAddEditPaymentType} from '@/api/paymentType/types';
import {paymentTypeStore} from '@/stores/cashier';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';
import {PaymentTypeKindOfOptions} from '../constants';

export const AddEditPaymentTypeModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addPaymentType} =
    useMutation({
      mutationKey: ['addPaymentType'],
      mutationFn: (params: IAddEditPaymentType) => paymentTypeApi.addPaymentType(params),
      onSuccess: () => {
        addNotification('Успешно добавлено новый тип склада.');
        queryClient.invalidateQueries({queryKey: ['getPaymentType']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updatePaymentType} =
    useMutation({
      mutationKey: ['updatePaymentType'],
      mutationFn: (params: IAddEditPaymentType) => paymentTypeApi.updatePaymentType(params),
      onSuccess: () => {
        addNotification('Успешное обновление типа склада');
        queryClient.invalidateQueries({queryKey: ['getPaymentType']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditPaymentType) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (paymentTypeStore?.singlePaymentType) {
      updatePaymentType({
        ...trimmedObject,
        id: paymentTypeStore?.singlePaymentType?.id,
      });

      return;
    }

    addPaymentType(trimmedObject);
  };

  const handleModalClose = () => {
    paymentTypeStore.setSinglePaymentType(null);
    paymentTypeStore.setIsOpenAddEditPaymentTypeModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (paymentTypeStore?.singlePaymentType) {
      form.setFieldsValue(paymentTypeStore?.singlePaymentType);
    }
  }, [paymentTypeStore?.singlePaymentType]);

  return (
    <Modal
      open={paymentTypeStore.isOpenAddEditPaymentTypeModal}
      title={paymentTypeStore?.singlePaymentType ? 'Изменить тип оплаты' : 'Создать тип оплаты'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
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
          name="name"
          label="Нал без чека"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Название тип склада" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Тип"
          rules={[{required: true}]}
        >
          <Select placeholder="Тип" options={PaymentTypeKindOfOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
