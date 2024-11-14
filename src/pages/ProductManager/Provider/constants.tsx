import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IUser} from '@/api/users/types';
import {Action} from './Action';

export const providerListColumns: ColumnType<IUser>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'avatar',
    dataIndex: 'avatar',
    title: 'Изображение',
    align: 'center',
    render: (value) => (
      <Avatar
        style={{cursor: 'pointer'}}
        src={`${imgStages?.apiUrl}${value}`} icon={<UserOutlined />}
      />
    ),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя поставщик',
    align: 'center',
    render: (value, record) => (
      <span>
        {`${record?.firstName} ${record?.lastName}`}
      </span>
    ),
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Номер телефон',
    align: 'center',
    render: (value, record) => <span>{`+${record?.phone}`}</span>,
  },
  {
    key: 'warehouse',
    dataIndex: 'warehouse',
    title: 'Склад',
    align: 'center',
    render: (value, record) => record?.warehouse?.name,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <Action provider={record} />,
  },
];
