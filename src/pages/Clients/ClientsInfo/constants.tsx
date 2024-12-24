import React from 'react';
import { ColumnType } from 'antd/es/table';
import { IClientsInfo } from '@/api/clients';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { priceFormat } from '@/utils/priceFormat';
import { dateFormatterWithStringMonth } from '@/utils/dateFormat';

export const clientsColumns: ColumnType<IClientsInfo>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Xodim',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Telefon raqami',
    align: 'center',
    render: (value, record) => `+${formatPhoneNumber(record?.phone)}`,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Mijoz qarzi',
    align: 'center',
    render: (value, record) => `${priceFormat(record?.debt)}$`,
  },
  {
    key: 'lastSale',
    dataIndex: 'lastSale',
    title: 'Oxirgi sotuv',
    align: 'center',
    render: (value, record) => dateFormatterWithStringMonth(record?.lastSale),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action client={record} />,
  },
];
