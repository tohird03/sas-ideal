import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IClientsInfo, ISupplierInfo} from '@/api/clients';
import {Action} from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';

export const supplierColumns: ColumnType<ISupplierInfo>[] = [
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
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action supplier={record} />,
  },
];
