import React from 'react';
import {ColumnType} from 'antd/es/table';
import {ISellerSaleClient} from '@/api/seller/sellerSaleAndOrder/types';

export const saleClientColumns: ColumnType<ISellerSaleClient>[] = [
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Клиента',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Номер телефона',
    align: 'center',
    render: (value, record) => `+998${record?.phone}`,
  },
  {
    key: 'from',
    dataIndex: 'from',
    title: 'Откуда пришёл',
    align: 'center',
    render: (value, record) => record?.clientFrom?.name,
  },
];
