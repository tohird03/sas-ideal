import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IClientStatus} from '@/api/seller/sellerClientStatus/types';
import {Action} from './Action';

export const warehouseTypeColumns: ColumnType<IClientStatus>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Наименование',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action clientStatus={record} />,
  },
];
