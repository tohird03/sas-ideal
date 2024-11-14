import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IModel} from '@/api/model/types';
import {ModelAction} from './Action';

export const modelColumns: ColumnType<IModel>[] = [
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
    title: 'Название модели',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'qtyPerDay',
    dataIndex: 'qtyPerDay',
    title: 'Количество в день',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'category',
    dataIndex: 'category',
    title: 'Категория',
    align: 'center',
    render: (value, record) => <span>{record?.category?.title}</span>,
  },
  // {
  //   key: 'action',
  //   dataIndex: 'action',
  //   title: 'Action',
  //   align: 'center',
  //   render: (value, record) => <ModelAction model={record} />,
  // },
];
