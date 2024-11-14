import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Alert, Col, Form, Input, InputNumber, Modal, Row, Select} from 'antd';
import {AxiosError, AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {cashierApi} from '@/api/cashier';
import {ICashierAction} from '@/api/cashier/types';
import {IPaymentRequestType} from '@/api/payment/types';
import {paymentTypeApi} from '@/api/paymentType';
import {cashierRequestStore} from '@/stores/cashier';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../requests.scss';

const cn = classNames.bind(styles);

export const AddEditPaymentTypeModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [amountAtRate, setAmountAtRate] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const {mutate: cashierPaymentRequestCreateMoney, isPending: loading} =
    useMutation({
      mutationKey: ['cashierPaymentRequestCreateMoney'],
      mutationFn: (params: ICashierAction) => cashierApi.cashierPaymentRequestCreateMoney(params),
      onSuccess: (data: AxiosResponse) => {
        if (data?.status === 204) {
          addNotification('Успешно добавлено новый тип склада.');
          queryClient.invalidateQueries({queryKey: ['getPaymentType']});
          handleModalClose();
        }
      },
      onError: addNotification,
    });

  const {data: paymentTypeData} = useQuery({
    queryKey: ['getpaymentTypeData'],
    queryFn: () => paymentTypeApi.getFullPaymentType(),
  });

  const handleSubmit = (value: ICashierAction) => {
    const trimmedObject = trimValues(value);

    cashierPaymentRequestCreateMoney({
      ...trimmedObject,
      total: totalPrice || 0,
      uzsWithCourse: amountAtRate || 0,
      paymentId: cashierRequestStore?.singleRequest?.id!,
      paymentTypeId: trimmedObject?.paymentTypeId,
      course100: trimmedObject?.course100 || 0,
      residue: trimmedObject?.residue || 0,
      usd: trimmedObject?.usd || 0,
      uzs: trimmedObject?.uzs || 0,
    });
  };

  const handleModalClose = () => {
    cashierRequestStore.setSingleRequest(null);
    cashierRequestStore.setIsOpenCreatePaymentModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handlePrePaymentUzsChange = (value: number | null) => {
    const residue = form.getFieldValue('residue');
    const totalPrice = (value || 0) + amountAtRate - parseInt(residue || 0, 10);

    setTotalPrice(totalPrice);
  };

  const handlePrePaymentUsdChange = (value: number | null) => {
    const {
      residue,
      uzs: prePaymentUzs,
      course100: prePaymentUsd,
    } = form.getFieldsValue();

    const totalRate = (parseInt(prePaymentUsd || 0, 10) / 100) * (value || 0);
    const totalPrice =
      totalRate + parseInt(prePaymentUzs || 0, 10) - parseInt(residue || 0, 10);

    setAmountAtRate(totalRate);
    setTotalPrice(totalPrice);
  };

  const handlePrePaymentcourse100Change = (value: number | null) => {
    const {
      residue,
      uzs: prePaymentUzs,
      usd: prePaymentUsd,
    } = form.getFieldsValue();

    const totalRate = ((value || 0) / 100) * parseInt(prePaymentUsd || 0, 10);
    const totalPrice =
      totalRate + parseInt(prePaymentUzs || 0, 10) - parseInt(residue || 0, 10);

    setAmountAtRate(totalRate);
    setTotalPrice(totalPrice);
  };

  const handleRestMoneyChange = (value: number | null) => {
    const prePaymentUzs = form.getFieldValue('uzs');

    const totalPrice = parseInt(prePaymentUzs || 0, 10) + amountAtRate - (value || 0);

    setTotalPrice(totalPrice);
  };

  const paymentTypeOptions = useMemo(() => (
    paymentTypeData?.map(paymentType => ({
      value: paymentType?.id,
      label: paymentType?.name,
    }))
  ), [paymentTypeData]);

  return (
    <Modal
      open={cashierRequestStore.isOpenCreatePaymentModal}
      title={cashierRequestStore?.singleRequest?.type === IPaymentRequestType.Incoming ? 'Приход' : 'Оплата'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
      width={1000}
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
              name="paymentTypeId"
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
            <Form.Item label="Доплата. сум" name="uzs">
              <InputNumber
                min={0}
                defaultValue={0}
                placeholder="Доплата. сум"
                formatter={(value) => priceFormat(value!)}
                onChange={handlePrePaymentUzsChange}
                className={cn('payment-form__feilds')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item label="Итого. сум">
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
                <Form.Item label="Доплата. $" name="usd">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    placeholder="Доплата. $"
                    formatter={(value) => priceFormat(value!)}
                    onChange={handlePrePaymentUsdChange}
                    className={cn('payment-form__feilds')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="Курс-$ 100" name="course100">
                  <InputNumber
                    min={0}
                    value={0}
                    defaultValue={0}
                    placeholder="КУРС-$ 100"
                    formatter={(value) => priceFormat(value!)}
                    onChange={handlePrePaymentcourse100Change}
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
                <Form.Item label="Здачи" name="residue">
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
                rules={[{required: true}]}
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
    </Modal>
  );
});
