import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Spin, notification } from 'antd';
import { observer } from 'mobx-react';
import { ordersStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { IPaymentType } from '@/api/types';
import { IAddEditPaymentParams } from '@/api/payment/types';
import { paymentApi } from '@/api/payment';
import { addNotification } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleModalClose = () => {
    ordersStore.setOrderPayment(null);
    ordersStore.setIsOpenPaymentModal(false);
  };

  const handleSavePayment = () => {
    form.submit();
  };

  const handleSubmitPayment = (values: IPaymentType) => {
    const orderPaymentData: IAddEditPaymentParams = {
      ...values,
      orderId: ordersStore.orderPayment?.orderId,
      clientId: ordersStore.orderPayment?.client?.id!,
    };

    if (ordersStore.orderPayment?.payment) {
      paymentApi.updatePayment({
        ...orderPaymentData,
        id: ordersStore.orderPayment?.payment?.id,
      })
        .then(res => {
          ordersStore.getSingleOrder(ordersStore.orderPayment?.orderId!);
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
          handleModalClose();
        })
        .catch(addNotification);

      return;
    }

    paymentApi.addPayment(orderPaymentData)
      .then(res => {
        ordersStore.getSingleOrder(ordersStore.orderPayment?.orderId!);
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        handleModalClose();
      })
      .catch(addNotification);
  };

  useEffect(() => {
    form.setFieldsValue({
      cash: ordersStore.orderPayment?.payment?.cash,
      card: ordersStore.orderPayment?.payment?.card,
      transfer: ordersStore.orderPayment?.payment?.transfer,
      other: ordersStore.orderPayment?.payment?.other,
      description: ordersStore.orderPayment?.payment?.description,
      clientId: ordersStore.orderPayment?.client?.id,
    });
  }, [ordersStore.orderPayment]);

  return (
    <Modal
      open={ordersStore.isOpenPaymentModal}
      title={`To'lov, ${ordersStore.orderPayment?.client?.name}`}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      keyboard
      style={{ top: 0, padding: '20px' }}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <Button
          onClick={handleSavePayment}
          type="primary"
        >
          Maqullash
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={handleSubmitPayment}
        layout="vertical"
        autoComplete="off"
        className="income-order__add-products-form-info"
      >
        <Form.Item
          label="Mijoz"
          rules={[{ required: true }]}
          name="clientId"
          initialValue={ordersStore.orderPayment?.client?.id}
        >
          <Select
            showSearch
            placeholder="Mijoz"
            optionFilterProp="children"
            options={[{
              value: ordersStore.orderPayment?.client?.id,
              label: `${ordersStore.orderPayment?.client?.name} ${ordersStore.orderPayment?.client?.phone}`,
            }]}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Bank kartasi orqali to'lov"
          name="card"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          name="cash"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Bank o'tkazmasi orqali to'lov"
          name="transfer"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank o'tkazmasi orqali to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Boshqa usullar bilan to'lov"
          name="other"
          initialValue={0}
        >
          <InputNumber
            placeholder="Boshqa usullar bilan to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="To'lov haqida ma'lumot"
          name="description"
        >
          <Input.TextArea
            placeholder="To'lov haqida ma'lumot"
            style={{ width: '100%' }}
            rows={4}
            maxLength={100}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
