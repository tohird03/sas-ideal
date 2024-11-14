import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IMyLogs} from '@/api/myLogs/types';
import {dateFormat} from '@/utils/getDateFormat';
import {MyLogsAction} from './Action';

export const myLogsColumns: ColumnType<IMyLogs>[] = [
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
    render: (value, record) => record?.product?.model && <span>{record?.product?.model?.name}</span>,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Дата',
    align: 'center',
    render: (value) => <span>{dateFormat('11.23.2023')}</span>,
  },
  {
    key: 'category',
    dataIndex: 'title',
    title: 'Категория',
    align: 'center',
    render: (value, record) => record.product?.category && <span>{record?.product.category?.title}</span>,
  },
  {
    key: 'tissue',
    dataIndex: 'tissue',
    title: 'Ткань',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Заглавье',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    key: 'my',
    dataIndex: 'my',
    title: 'Продавца / тел. номер',
    align: 'center',
    render: (value, record) => <span>Имя продавца <br /> +998 90 123 45 67</span>,
  },
  {
    key: 'my',
    dataIndex: 'my',
    title: 'Клиент / тел. номер',
    align: 'center',
    render: (value, record) => <span>Имя продавца <br /> +998 90 123 45 67</span>,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Дата доставки',
    align: 'center',
    render: (value) => <span>{dateFormat('11.23.2023')}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <MyLogsAction myLogs={record} />,
  },
];
