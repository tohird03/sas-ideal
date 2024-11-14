import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IOrder} from '@/api/orders/types';
import {getDateFormat} from '@/utils/getDataFormat';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';

export const myOrdersColumns: ColumnType<IOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'id',
    dataIndex: 'id',
    title: 'ID',
    align: 'center',
    render: (value, record) => record?.orderId,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Клиент',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{margin: '0', fontWeight: 'bold'}}>{record?.client?.name}</p>
        <p style={{margin: '0', fontSize: '14px'}}>+{record?.client?.phone}</p>
      </div>
    ),
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Кол-во продуктов',
    align: 'center',
    render: (value, record) => <span>{record?.orderDetailsCount} шт</span>,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => <Tag>{record?.status}</Tag>,
  },
  {
    key: 'deliveryDate',
    dataIndex: 'deliveryDate',
    title: 'Срок доставки',
    align: 'center',
    render: (value, record) => getDateFormat(record?.deliveryDate),
  },
  {
    key: 'rest',
    dataIndex: 'rest',
    title: 'Конечный остаток',
    align: 'center',
    render: (value, record) => priceFormat(record?.debt),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action order={record} />,
  },
];
