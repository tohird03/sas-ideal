import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {AxiosError} from 'axios';
import {sellerClientStatusApi} from '@/api/seller';
import {IAddEditClientStatus} from '@/api/seller/sellerClientStatus/types';
import {clientInfoStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditStatusClient = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addClientStatus} =
    useMutation({
      mutationKey: ['addClientStatus'],
      mutationFn: (params: IAddEditClientStatus) => sellerClientStatusApi.addClientStatus(params),
      onSuccess: () => {
        addNotification('Успешное добавление статуса нового клиента');
        queryClient.invalidateQueries({queryKey: ['getClientStatus']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateClientStatus} =
    useMutation({
      mutationKey: ['updateClientStatus'],
      mutationFn: (params: IAddEditClientStatus) => sellerClientStatusApi.updateClientStatus(params),
      onSuccess: () => {
        addNotification('Успешное изменение статуса нового клиента');
        queryClient.invalidateQueries({queryKey: ['getClientStatus']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditClientStatus) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (clientInfoStore?.singleClientStatus) {
      updateClientStatus({
        ...trimmedObject,
        id: clientInfoStore?.singleClientStatus?.id,
      });

      return;
    }

    addClientStatus(trimmedObject);
  };

  const handleModalClose = () => {
    clientInfoStore.setSingleClientStatus(null);
    clientInfoStore.setIsOpenAddEditClientStatusModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (clientInfoStore?.singleClientStatus) {
      form.setFieldsValue(clientInfoStore?.singleClientStatus);
    }
  }, [clientInfoStore?.singleClientStatus]);

  return (
    <Modal
      open={clientInfoStore.isOpenAddEditClientStatusModal}
      title={clientInfoStore?.singleClientStatus ? 'Изменить' : 'Новый'}
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
