import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IExpenseType} from '@/api/expenseType/type';
import {Action} from './Action';

export const expenseColumns: ColumnType<IExpenseType>[] = [
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
    render: (value, record) => <Action expenseType={record} />,
  },
];
