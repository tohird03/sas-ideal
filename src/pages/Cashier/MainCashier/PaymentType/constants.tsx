import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IPaymentType, IPaymentTypeKindOf} from '@/api/paymentType/types';
import {Action} from './Action';

export const paymentTypeColumns: ColumnType<IPaymentType>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'title',
    dataIndex: 'title',
    title: 'Наименование',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Тип',
    align: 'center',
    render: (value, record) => PaymentTypeKindOfTranslate[record?.type],
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action paymentType={record} />,
  },
];

export const PaymentTypeKindOfTranslate: Record<IPaymentTypeKindOf, string> = {
  [IPaymentTypeKindOf.Cash]: 'Наличные',
  [IPaymentTypeKindOf.Card]: 'Карта',
};

export const PaymentTypeKindOfOptions = [
  {
    value: IPaymentTypeKindOf.Cash,
    label: PaymentTypeKindOfTranslate[IPaymentTypeKindOf.Cash],
  },
  {
    value: IPaymentTypeKindOf.Card,
    label: PaymentTypeKindOfTranslate[IPaymentTypeKindOf.Card],
  },
];
