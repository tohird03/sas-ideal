import React from 'react';
import {ColumnType} from 'antd/es/table';
import {CategoryAction} from './Action';

export const categoriesColumns: ColumnType<any>[] = [
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
    title: 'Название категории',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Количество моделей',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <CategoryAction category={record} subCategory={record} />,
  },
];
