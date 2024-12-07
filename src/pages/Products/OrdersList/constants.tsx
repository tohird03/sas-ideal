import React from 'react';
import { ColumnType } from 'antd/es/table';
import { IClientsInfo, ISupplierInfo } from '@/api/clients';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { IOrder } from '@/api/order/types';
import { Tag } from 'antd';
import { getFullDateFormat } from '@/utils/getDateFormat';

export const ordersColumns: ColumnType<IOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Mijoz',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.client?.name}</p>
        <i>+{record?.client?.phone}</i>
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Sotuv holati',
    align: 'center',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[String(record?.accepted)]}
      >
        {OrderStatus[String(record?.accepted)]}
      </Tag>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.seller?.name}</p>
        <i>+{record?.seller?.phone}</i>
      </div>
    ),
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.sum,
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => 'Jami to\'lov',
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => 'Qarzga',
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.payment?.cash,
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.payment?.card,
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.payment?.transfer,
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.payment?.transfer,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    width: '150px',
    render: (value, record) => <Action orders={record} />,
  },
];


const OrderStatus: Record<string, string> = {
  true: 'Tasdiqlangan',
  false: 'Tasdiqlanmagan',
};

const OrderStatusColor: Record<string, string> = {
  true: '#178c03',
  false: '#ff7700',
};
