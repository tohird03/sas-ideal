import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IPromotion, IPromotionStatus} from '@/api/promotion/types';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {Action} from './Action';

export const promotionColumns: ColumnType<IPromotion>[] = [
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
    title: 'Наименование акции',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'startDate',
    dataIndex: 'startDate',
    title: 'Начало',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.startDate),
  },
  {
    key: 'endDate',
    dataIndex: 'endDate',
    title: 'Конец',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.endDate),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag color={PromotionStatusColor[record?.status]}>{record?.status}</Tag>
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Примечание',
    align: 'center',
    render: (value, record) => record?.note,
  },
  {
    key: 'productCount',
    dataIndex: 'productCount',
    title: 'Для продуктов',
    align: 'center',
    render: (value, record) => `${record?.productsCount} шт`,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action promotion={record} />,
  },
];


export const PromotionStatusColor = {
  [IPromotionStatus.Pending]: 'blue',
  [IPromotionStatus.Active]: 'green',
  [IPromotionStatus.Inactive]: 'red',
};
