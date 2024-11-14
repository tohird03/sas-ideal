import React from 'react';
import {Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IOrder} from '@/api/orders/types';
import {IProductStatus, ProductStatusColor, ProductStatusText} from '@/api/types';
import {dateFormat} from '@/utils/getDateFormat';
import {Action} from './Action';

export const applyProductsColumns: ColumnType<IOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'productId',
    dataIndex: 'productId',
    title: 'ID заказа',
    align: 'center',
    render: (value, record) => record?.orderId,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Клиент',
    align: 'center',
    render: (value, record) => (
      <>
        <Typography.Title
          style={{margin: 0}}
          level={5}
        >
          {record?.client?.name}
        </Typography.Title>
        <Typography.Text>
          +{record?.client?.phone}
        </Typography.Text>
      </>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Продавец',
    align: 'center',
    render: (value, record) => (
      <>
        <Typography.Title
          style={{margin: 0}}
          level={5}
        >
          {record?.seller?.firstName}
          {record?.seller?.lastName}
        </Typography.Title>
        <Typography.Text>
          +{record?.seller?.phone}
        </Typography.Text>
      </>
    ),
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Кол-во продуктов',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag color={ProductStatusColor[record?.status!]}>
        {ProductStatusText[record?.status!] || record?.status}
      </Tag>
    ),
  },
  {
    key: 'deadline',
    dataIndex: 'deadline',
    title: 'Срок доставки',
    align: 'center',
    render: (value, record) => <span>{dateFormat(record?.deliveryDate)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Больше информации',
    align: 'center',
    render: (value, record) => <Action order={record} />,
  },
];

export const ChangeStatusOption = {
  [IProductStatus.NEW]: [
    {
      value: IProductStatus.CHECKED,
      label: ProductStatusText[IProductStatus.CHECKED],
    },
  ],
};
