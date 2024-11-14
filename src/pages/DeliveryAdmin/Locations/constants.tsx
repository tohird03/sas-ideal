import React from 'react';
import {ColumnType} from 'antd/es/table';
import {ILocation} from '@/api/locations/types';
import {Actions} from './Actions';

export const locationsColumn: ColumnType<ILocation>[] = [
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
    title: 'Локации',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действия',
    align: 'center',
    render: (value, record) => <Actions location={record} />,
  },
];
