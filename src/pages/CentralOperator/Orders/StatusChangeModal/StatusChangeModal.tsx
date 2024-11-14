import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Modal, Select} from 'antd';
import {AxiosResponse} from 'axios';
import {ordersApi} from '@/api/orders';
import {IOrderUpdateParams} from '@/api/orders/types';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {IProviderProductStatusChange} from '@/api/wmsOrders/types';
import {ordersStore} from '@/stores/centralOperator';
import {addNotification} from '@/utils';
import {ChangeStatusOption} from '../constants';

export const OrderStatusChangeModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const optionsForStatus = ChangeStatusOption[ordersStore?.singleOrder?.status as keyof typeof ChangeStatusOption];

  const {mutate: updateOrder, isPending: loading} =
  useMutation({
    mutationKey: ['updateOrder'],
    mutationFn: (params: IOrderUpdateParams) => ordersApi.updateOrder(params!),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getAllOrders']});
        addNotification('Дата доставки успешно изменена');
        handleModalClose();
      }
    },
    onError: addNotification,
  });

  const handleFinishAdd = () => {
    form.submit();
  };

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setIsOpenProductStatusChangeModal(false);
  };

  const handleChangeStatus = (value: {status: IProductStatus}) => {
    updateOrder({
      status: value?.status!,
      orderId: ordersStore?.singleOrder?.id!,
    });
  };

  return (
    <Modal
      open={ordersStore?.isOpenProductStatusChangeModal}
      onOk={handleFinishAdd}
      onCancel={handleModalClose}
      title="Изменить статус"
      confirmLoading={loading}
      centered
    >
      <Form
        layout="vertical"
        onFinish={handleChangeStatus}
        form={form}
      >
        <Form.Item
          label="Select a status"
          name="status"
          rules={[{required: true, message: 'Please select a status'}]}
        >
          <Select
            options={optionsForStatus?.map((option) => ({
              value: option?.value,
              label: option?.label,
            }))}
            placeholder="Select a status"
            className="w-full p-10 m-3"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
