import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, InputNumber, Modal } from 'antd';
import { addNotification } from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { supplierInfoStore, supplierPaymentsStore } from '@/stores/supplier';
import { incomePaymentApi } from '@/api/payment-income';
import { IIncomeAddEditPaymentParams } from '@/api/payment-income/types';
import { useParams } from 'react-router-dom';
import { returnedOrdersStore } from '@/stores/products';
import { returnedOrderApi } from '@/api/returned-order/returned-order';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const { supplierId } = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchSupplier, setSearchSupplier] = useState<string | null>(null);

  // GET DATAS
  const { data: singleClientData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchSupplier],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: 1,
        pageSize: 15,
        search: searchSupplier!,
      }),
  });

  const handleSubmit = (values: IIncomeAddEditPaymentParams) => {
    setLoading(true);

    if (returnedOrdersStore?.singleReturnedOrder?.id) {
      returnedOrderApi.updateReturnedOrder({
        ...values,
        accepted: true,
        id: returnedOrdersStore?.singleReturnedOrder?.id!,
      })
        .then(() => {
          addNotification('Qaytuv tasdiqlandi');
          returnedOrdersStore.getSingleOrder(returnedOrdersStore?.singleReturnedOrder?.id!);
          queryClient.invalidateQueries({ queryKey: ['getReturnedOrders'] });
          handleModalClose();
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleModalClose = () => {
    returnedOrdersStore.setSinglePayment(null);
    returnedOrdersStore.setSingleReturnedOrder(null);
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(false);
    returnedOrdersStore.setIsOpenPaymentModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (returnedOrdersStore.singlePayment) {
      form.setFieldsValue(returnedOrdersStore.singlePayment);
    }
  }, [returnedOrdersStore.singlePayment]);

  return (
    <Modal
      open={returnedOrdersStore.isOpenPaymentModal}
      title="Qaytuvni tasdiqlash"
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Maqullash"
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
          label="Mijozning hisobidan ayirish"
          name="fromClient"
          initialValue={0}
        >
          <InputNumber
            placeholder="Mijozning hisobidan ayirish"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          name="cashPayment"
          initialValue={0}
        >
          <InputNumber
            placeholder="Naqd to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
