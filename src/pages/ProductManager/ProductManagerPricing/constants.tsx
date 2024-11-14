import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IGetCategoryManagerPricing} from '@/api/productmanager/tyes';
import {ProductManagerPricingActions} from './ProductManagerPricingActions';

export const productManagerPricingColumn: ColumnType<IGetCategoryManagerPricing[]>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (_value, _record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя продукта',
    align: 'center',
  },
  {
    key: 'formula',
    dataIndex: 'formula',
    title: 'Формула',
    align: 'center',
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Тип',
    align: 'center',
  },
  {
    key: 'necessarily',
    dataIndex: 'necessarily',
    title: 'Обязателно',
    align: 'center',
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => (<ProductManagerPricingActions pricing={record} />),
  },
];
