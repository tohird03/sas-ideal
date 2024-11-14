import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {AxiosError} from 'axios';
import {sellerClientFromApi} from '@/api/seller';
import {IAddEditClientFrom} from '@/api/seller/sellerClientFrom/types';
import {clientInfoStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditFromClientModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addClientFrom} =
    useMutation({
      mutationKey: ['addClientFrom'],
      mutationFn: (params: IAddEditClientFrom) => sellerClientFromApi.addClientFrom(params),
      onSuccess: () => {
        addNotification('Успешно добавлено нового клиента из');
        queryClient.invalidateQueries({queryKey: ['getClientFrom']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateClientFrom} =
    useMutation({
      mutationKey: ['updateClientFrom'],
      mutationFn: (params: IAddEditClientFrom) => sellerClientFromApi.updateClientFrom(params),
      onSuccess: () => {
        addNotification('Успешное редактирование нового клиента из');
        queryClient.invalidateQueries({queryKey: ['getClientFrom']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditClientFrom) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (clientInfoStore?.singleClientFrom) {
      updateClientFrom({
        ...trimmedObject,
        id: clientInfoStore?.singleClientFrom?.id,
      });

      return;
    }

    addClientFrom(trimmedObject);
  };

  const handleModalClose = () => {
    clientInfoStore.setSingleClientFrom(null);
    clientInfoStore.setIsOpenAddEditFromClientModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (clientInfoStore?.singleClientFrom) {
      form.setFieldsValue(clientInfoStore?.singleClientFrom);
    }
  }, [clientInfoStore?.singleClientFrom]);

  return (
    <Modal
      open={clientInfoStore.isOpenAddEditFromClientModal}
      title={clientInfoStore?.singleClientFrom ? 'Изменить' : 'Новый'}
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
          label="Наименование"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Наименование" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
