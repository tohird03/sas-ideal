import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IWarehouses} from '@/api/wmsWarehouses/types';
import {Action} from './Action';

export const warehouseListColumns: ColumnType<IWarehouses>[] = [
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
    title: 'Склад',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'location',
    dataIndex: 'location',
    title: 'Локация',
    align: 'center',
    render: (value, record) => record?.location,
  },
  {
    key: 'warehouseType',
    dataIndex: 'warehouseType',
    title: 'Тип',
    align: 'center',
    render: (value, record) => record?.warehouseType?.name,
  },
  {
    key: 'productQty',
    dataIndex: 'productQty',
    title: 'Количество продуктов',
    align: 'center',
    render: (value, record) => <span>{record?.productCount} шт</span>,
  },
  {
    key: 'proccesQty',
    dataIndex: 'proccesQty',
    title: 'В процессе',
    align: 'center',
    render: (value, record) => <span>{record?.processCount} шт</span>,
  },
  {
    key: 'minAmount',
    dataIndex: 'minAmount',
    title: 'Мин. остаток',
    align: 'center',
    render: (value, record) => <span>{record?.minCount} шт</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Подробное',
    align: 'center',
    render: (value, record) => <Action warehouse={record} />,
  },
];
