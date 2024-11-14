import React, {useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from 'antd';
import {AxiosResponse} from 'axios';
import classnamesBind from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {ISellerPrePaymentToOrder} from '@/api/orders/types';
import {paymentTypeApi} from '@/api/paymentType';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISellerProductSalePayments} from '@/api/seller/sellerSaleAndOrder/types';
import {DataTable} from '@/components/Datatable/datatable';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {addNotification} from '@/utils';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {productSalePaymentsColumns} from '../../constants';
import styles from '../order-payment.scss';

const cn = classnamesBind.bind(styles);

export const PrePaymentModal = observer(() => {
  const {orderId} = useParams();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [form] = Form.useForm();
  const [amountAtRate, setAmountAtRate] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const {data: paymentTypeData} = useQuery({
    queryKey: ['getpaymentTypeData'],
    queryFn: () => paymentTypeApi.getFullPaymentType(),
  });

  const {mutate: addPrePaymentsToOrder, isPending: prePaymentLoading} =
  useMutation({
    mutationKey: ['addPrePaymentsToOrder'],
    mutationFn: (params: ISellerPrePaymentToOrder) => ordersApi.addPrePaymentsToOrder(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMySingleOrder']});
        addNotification('Пополнение успешно!');
        handleModalClose();
      }
    },
    onError: addNotification,
  });

  const handleModalClose = () => {
    form.resetFields();
    setTotalPrice(0);
    setAmountAtRate(0);
    sellerMyOrdersStore.setMySingleOrderPrePayments([]);
    sellerMyOrdersStore.setIsOpenMySingleOrderPrePaymentsModal(false);
  };

  const handleModalOk = () => {
    addPrePaymentsToOrder({
      orderId: orderId!,
      payments: sellerMyOrdersStore?.mySingleOrderPrePayments,
    });
  };

  const handleSubmit = (values: ISellerProductSalePayments) => {
    const newPayment: ISellerProductSalePayments = {
      totalSum: totalPrice,
      uzsByCourse: amountAtRate,
      paymentType: values?.paymentType,
      uzs: values?.uzs || 0,
      usd: values?.usd || 0,
      rest: values?.rest || 0,
      course: values?.course || 0,
      description: values?.description || '',
      id: sellerMyOrdersStore.mySingleOrderPrePayments[sellerMyOrdersStore.mySingleOrderPrePayments?.length - 1]?.id + 1 || 1,
    };

    sellerMyOrdersStore?.setMySingleOrderPrePayments([...sellerMyOrdersStore.mySingleOrderPrePayments, newPayment]);
    setTotalPrice(0);
    setAmountAtRate(0);
    form.resetFields();
  };

  const handlePrePaymentUzsChange = (value: number | null) => {
    const rest = form.getFieldValue('rest');
    const totalPrice = (value || 0) + amountAtRate - parseInt(rest || 0, 10);

    setTotalPrice(totalPrice);
  };

  const handlePrePaymentUsdChange = (value: number | null) => {
    const {
      rest,
      uzs: prePaymentUzs,
      course: prePaymentUsd,
    } = form.getFieldsValue();

    const totalRate = (parseInt(prePaymentUsd || 0, 10) / 100) * (value || 0);
    const totalPrice =
      totalRate + parseInt(prePaymentUzs || 0, 10) - parseInt(rest || 0, 10);

    setAmountAtRate(totalRate);
    setTotalPrice(totalPrice);
  };

  const handlePrePaymentcourseChange = (value: number | null) => {
    const {
      rest,
      uzs: prePaymentUzs,
      usd: prePaymentUsd,
    } = form.getFieldsValue();

    const totalRate = ((value || 0) / 100) * parseInt(prePaymentUsd || 0, 10);
    const totalPrice =
      totalRate + parseInt(prePaymentUzs || 0, 10) - parseInt(rest || 0, 10);

    setAmountAtRate(totalRate);
    setTotalPrice(totalPrice);
  };

  const handleRestMoneyChange = (value: number | null) => {
    const prePaymentUzs = form.getFieldValue('uzs');

    const totalPrice = parseInt(prePaymentUzs || 0, 10) + amountAtRate - (value || 0);

    setTotalPrice(totalPrice);
  };

  const handleClearForm = () => {
    form.resetFields();
  };

  const handleAddPayment = () => {
    form.submit();
  };

  const paymentTypeOptions = useMemo(() => (
    paymentTypeData?.map(paymentType => ({
      value: paymentType?.name,
      label: paymentType?.name,
    }))
  ), [paymentTypeData]);

  return (
    <Modal
      open={sellerMyOrdersStore.isOpenMySingleOrderPrePaymentsModal}
      onOk={handleModalOk}
      onCancel={handleModalClose}
      title="Оплата"
      centered
      width={'1200px'}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={prePaymentLoading}
      okButtonProps={{disabled: sellerMyOrdersStore.mySingleOrderPrePayments?.length === 0}}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Row gutter={24} justify="center" align="top">
          <Col xs={24} lg={8}>
            <Form.Item
              label="Вид оплаты"
              name="paymentType"
              rules={[{required: true}]}
            >
              <Select
                showSearch
                placeholder="Вид оплаты"
                optionFilterProp="children"
                options={paymentTypeOptions}
                className={cn('payment-form__feilds')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="Оплата. сум"
              name="uzs"
            >
              <InputNumber
                min={0}
                defaultValue={0}
                placeholder="Оплата. сум"
                formatter={(value) => priceFormat(value!)}
                onChange={handlePrePaymentUzsChange}
                className={cn('payment-form__feilds')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="Итого. сум"
            >
              <Alert
                message={priceFormat(totalPrice) || '0'}
                className={cn('payment-form__feilds')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} align="top" justify="center">
          <Col xs={24} lg={16}>
            <Row gutter={24} align="top">
              <Col xs={24} lg={12}>
                <Form.Item label="Оплата. $" name="usd">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    placeholder="Оплата. $"
                    formatter={(value) => priceFormat(value!)}
                    onChange={handlePrePaymentUsdChange}
                    className={cn('payment-form__feilds')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="Курс-$ 100" name="course">
                  <InputNumber
                    min={0}
                    value={0}
                    defaultValue={0}
                    placeholder="КУРС-$ 100"
                    formatter={(value) => priceFormat(value!)}
                    onChange={handlePrePaymentcourseChange}
                    className={cn('payment-form__feilds')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} align="top">
              <Col xs={24} lg={12}>
                <Form.Item label="Сумма по курсу">
                  <Alert
                    message={priceFormat(amountAtRate) || '0'}
                    className={cn('payment-form__feilds')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="Здачи" name="rest">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    placeholder="Здачи"
                    formatter={(value) => priceFormat(value!)}
                    onChange={handleRestMoneyChange}
                    className={cn('payment-form__feilds')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={8}>
            <Col xs={24} lg={24}>
              <Form.Item
                label="Загаловок"
                name={'description'}
                style={{width: '100%'}}
              >
                <Input.TextArea
                  allowClear
                  style={{width: '100%'}}
                  className={cn('payment-form__feilds')}
                  autoSize={{minRows: 5, maxRows: 5}}
                  placeholder="Загаловок"
                />
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </Form>
      <div className={cn('paymentControllBtnWrapp')}>
        <Button
          type="default"
          onClick={handleClearForm}
        >
            Очистить
        </Button>
        <Button
          type="primary"
          onClick={handleAddPayment}
        >
            Добавить
        </Button>
      </div>

      <Typography.Title level={4}>Список оплата</Typography.Title>
      <DataTable
        isMobile={isMobile}
        columns={productSalePaymentsColumns}
        data={sellerMyOrdersStore.mySingleOrderPrePayments}
        pagination={false}
      />
    </Modal>
  );
});
