import React, { useEffect } from 'react';
import { Button, Form, InputNumber, Modal, Select } from 'antd';
import { observer } from 'mobx-react';
import { priceFormat } from '@/utils/priceFormat';
import { IPaymentType } from '@/api/types';
import { paymentApi } from '@/api/payment';
import { addNotification } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { incomeProductsStore } from '@/stores/products';
import { IIncomeAddEditPaymentParams } from '@/api/payment-income/types';
import { incomePaymentApi } from '@/api/payment-income';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleModalClose = () => {
    incomeProductsStore.setIncomeOrderPayment(null);
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
    incomeProductsStore.setIsOpenIncomePaymentModal(false);
  };

  const handleSavePayment = () => {
    form.submit();
  };

  const handleSubmitPayment = (values: IPaymentType) => {
    const orderPaymentData: IIncomeAddEditPaymentParams = {
      ...values,
      orderId: incomeProductsStore.incomeOrderPayment?.orderId,
      supplierId: incomeProductsStore.incomeOrderPayment?.supplierId!,
    };

    if (incomeProductsStore.incomeOrderPayment?.payment) {
      incomePaymentApi.updateIncomePayment({
        ...orderPaymentData,
        id: incomeProductsStore.incomeOrderPayment?.payment?.id,
      })
        .then(res => {
          incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrderPayment?.orderId!);
          queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
          handleModalClose();
        })
        .catch(addNotification);

      return;
    }

    incomePaymentApi.addIncomePayment(orderPaymentData)
      .then(res => {
        incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrderPayment?.orderId!);
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        handleModalClose();
      })
      .catch(addNotification);
  };

  useEffect(() => {
    form.setFieldsValue({
      cash: incomeProductsStore.incomeOrderPayment?.payment?.cash,
      card: incomeProductsStore.incomeOrderPayment?.payment?.card,
      transfer: incomeProductsStore.incomeOrderPayment?.payment?.transfer,
      other: incomeProductsStore.incomeOrderPayment?.payment?.other,
      supplierId: incomeProductsStore.incomeOrderPayment?.supplierId,
    });
  }, [incomeProductsStore.incomeOrderPayment]);

  return (
    <Modal
      open={incomeProductsStore.isOpenIncomeOrderPaymentModal}
      // title={`To'lov, ${incomeProductsStore.incomeOrderPayment?.supplierId?.name}`}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      style={{ top: 0, padding: 0 }}
      bodyStyle={{
        height: '90vh',
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
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="supplierId"
          initialValue={incomeProductsStore.incomeOrderPayment?.supplierId}
        >
          <Select
            showSearch
            placeholder="Yetkazib beruvchi"
            optionFilterProp="children"
            options={[{
              value: incomeProductsStore.incomeOrderPayment?.supplierId,
              label: `${incomeProductsStore.incomeOrderPayment?.supplierId} ${incomeProductsStore.incomeOrderPayment?.supplierId}`,
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
      </Form>
    </Modal>
  );
});
