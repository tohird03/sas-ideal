import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {AxiosError} from 'axios';
import {directionApi} from '@/api/direction';
import {IAddEditDirectionParams} from '@/api/direction/types';
import {pmDirectionStore} from '@/stores/productManager';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditDirectionModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addDirection} =
    useMutation({
      mutationKey: ['addDirection'],
      mutationFn: (params: IAddEditDirectionParams) => directionApi.addDirection(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getDirection']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateDirection} =
    useMutation({
      mutationKey: ['updateDirection'],
      mutationFn: (params: IAddEditDirectionParams) => directionApi.updateDirection(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getDirection']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditDirectionParams) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (pmDirectionStore?.singleDirection) {
      updateDirection({
        ...trimmedObject,
        id: pmDirectionStore?.singleDirection?.id,
      });

      return;
    }

    addDirection(trimmedObject);
  };

  const handleModalClose = () => {
    pmDirectionStore.setSingleDirection(null);
    pmDirectionStore.setIsOpenAddEditDirectionModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (pmDirectionStore.singleDirection) {
      form.setFieldsValue(pmDirectionStore.singleDirection);
    }
  }, [pmDirectionStore.singleDirection]);

  return (
    <Modal
      open={pmDirectionStore.isOpenAddEditDirectionModal}
      title={pmDirectionStore.singleDirection ? 'Изменить Углы' : 'Новый Углы'}
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
          name="title"
          label="Название Углы"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Название Углы" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
