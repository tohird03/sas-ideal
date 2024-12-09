import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { IAddOrderProducts } from '@/api/order/types';

export const addOrderProductsColumns: ColumnType<IAddOrderProducts>[] = [
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
    render: (value, record) => `${record?.price}$`,
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
    render: (value, record) => `${record?.price * record?.count}$`,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action incomeProduct={record} />,
  },
];
