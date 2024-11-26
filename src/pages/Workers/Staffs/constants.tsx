import React from 'react';
import {ColumnType} from 'antd/es/table';
import {formatNumber} from '@/utils/formatInputNumber';
import {Action} from './Action';
import { IStaffs } from '@/api/staffs';

export const staffsColumns: ColumnType<IStaffs>[] = [
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
    render: (value, record) => record?.phone,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action staff={record} />,
  },
];
