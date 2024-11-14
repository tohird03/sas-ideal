import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {AxiosError} from 'axios';
import {warehouseTypeApi} from '@/api/warehouseType';
import {IAddEditWarehouseTypeParams} from '@/api/warehouseType/types';
import {warehouseTypeStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditWarehouseTypeModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addWarehouseType} =
    useMutation({
      mutationKey: ['addWarehouseType'],
      mutationFn: (params: IAddEditWarehouseTypeParams) => warehouseTypeApi.addWarehouseType(params),
      onSuccess: () => {
        addNotification('Успешно добавлено новый тип склада.');
        queryClient.invalidateQueries({queryKey: ['getWarehouseType']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateWarehouseType} =
    useMutation({
      mutationKey: ['updateWarehouseType'],
      mutationFn: (params: IAddEditWarehouseTypeParams) => warehouseTypeApi.updateWarehouseType(params),
      onSuccess: () => {
        addNotification('Успешное обновление типа склада');
        queryClient.invalidateQueries({queryKey: ['getWarehouseType']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditWarehouseTypeParams) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (warehouseTypeStore?.singleWarehouseType) {
      updateWarehouseType({
        ...trimmedObject,
        id: warehouseTypeStore?.singleWarehouseType?.id,
      });

      return;
    }

    addWarehouseType(trimmedObject);
  };

  const handleModalClose = () => {
    warehouseTypeStore.setSingleWarehouseType(null);
    warehouseTypeStore.setIsOpenAddEditWarehouseTypeModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (warehouseTypeStore.singleWarehouseType) {
      form.setFieldsValue(warehouseTypeStore.singleWarehouseType);
    }
  }, [warehouseTypeStore.singleWarehouseType]);

  return (
    <Modal
      open={warehouseTypeStore.isOpenAddEditWarehouseTypeModal}
      title={warehouseTypeStore.singleWarehouseType ? 'Изменить тип склада' : 'Новый тип склада'}
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
          label="Название тип склада"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Название тип склада" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
