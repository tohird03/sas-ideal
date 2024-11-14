import React from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {DatePicker, Form, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import {ordersApi} from '@/api/orders';
import {IOrderUpdateParams} from '@/api/orders/types';
import {ordersStore} from '@/stores/centralOperator';
import {addNotification} from '@/utils';

export const ChangeDeliveryDateModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

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
    ordersStore.setIsOpenProductChangeDeliveryDateModal(false);
  };

  const handleDelivryDateChange = (value: IOrderUpdateParams) => {
    updateOrder({
      deliveryDate: value?.deliveryDate,
      orderId: ordersStore?.singleOrder?.id!,
    });
  };

  return (
    <Modal
      open={ordersStore?.isOpenProductChangeDeliveryDateModal}
      onOk={handleFinishAdd}
      onCancel={handleModalClose}
      title="Изменить дату отгрузки"
      confirmLoading={loading}
      centered
    >
      <Form
        layout="vertical"
        onFinish={handleDelivryDateChange}
        form={form}
      >
        <Form.Item
          label="Выберите"
          name="deliveryDate"
          rules={[{required: true}]}
        >
          <DatePicker
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
