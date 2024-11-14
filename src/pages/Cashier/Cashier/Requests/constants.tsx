import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IPayment, IPaymentRequestType} from '@/api/payment/types';
import {Action} from './Action';

export const requestsColumns: ColumnType<IPayment>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Тип',
    align: 'center',
    render: (value, record) => PaymentKindOfTranslate[record?.type],
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => <Tag color="green">{record?.status}</Tag>,
  },
  {
    key: 'contact',
    dataIndex: 'contact',
    title: 'Контактное лицо',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{margin: 0, fontWeight: 'bold'}}>{record?.contactName}</p>
        <p style={{margin: 0, fontSize: '14px'}}>+{record?.contactPhone}</p>
      </div>
    ),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action payment={record} />,
  },
];

export const PaymentKindOfTranslate: Record<IPaymentRequestType, string> = {
  [IPaymentRequestType.Expense]: 'Расход',
  [IPaymentRequestType.Incoming]: 'Приход',
};
