import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IDirection} from '@/api/direction/types';
import {Action} from './Action';

export const directionColumns: ColumnType<IDirection>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Наименование',
    align: 'center',
    render: (value, record) => record?.title,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action direction={record} />,
  },
];
