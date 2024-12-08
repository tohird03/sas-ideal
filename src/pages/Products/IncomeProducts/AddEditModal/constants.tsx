import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IAddIncomeOrderProducts } from '@/api/income-products/types';

export const addIncomeOrderProductsColumns: ColumnType<IAddIncomeOrderProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'product_name',
    dataIndex: 'product_name',
    title: 'Mahsulot nomi',
    align: 'center',
    render: (value, record) => record?.product_name,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Narxi',
    align: 'center',
    render: (value, record) => `${record?.cost}$`,
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Soni',
    align: 'center',
    render: (value, record) => `${record?.count} dona`,
  },
  {
    key: 'totalCost',
    dataIndex: 'totalCost',
    title: 'Jami narxi',
    align: 'center',
    render: (value, record) => `${record?.cost * record?.count}$`,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action incomeProduc={record} />,
  },
];
