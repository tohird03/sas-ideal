import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IIncomeOrder } from '@/api/income-products/types';
import { priceFormat } from '@/utils/priceFormat';
import { dateFormatterWithStringMonth } from '@/utils/dateFormat';

export const incomeOrdersColumns: ColumnType<IIncomeOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'supplier',
    dataIndex: 'supplier',
    title: 'Yetkazib beruvchi',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{margin: 0, fontWeight: 'bold'}}>{record?.supplier?.name}</p>
        <i>+{record?.supplier?.phone}</i>
      </div>
    ),
  },
  {
    key: 'staff',
    dataIndex: 'staff',
    title: 'Qabul qiluvchi',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{margin: 0, fontWeight: 'bold'}}>{record?.admin?.name}</p>
        <i>+{record?.admin?.phone}</i>
      </div>
    ),
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => `${priceFormat(record?.sum)}$`,
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => `${priceFormat(record?.payment?.totalPay)}$`,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => `${priceFormat(record?.debt)}$`,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Tushurilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => dateFormatterWithStringMonth(record?.createdAt),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action order={record} />,
  },
];
