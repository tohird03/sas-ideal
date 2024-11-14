import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IUser} from '@/api/users/types';
import {Action, RolesAction} from './Action';

export const myUsersListColumns: ColumnType<IUser>[] = [
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
    title: 'Имя',
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
    key: 'role',
    dataIndex: 'role',
    title: 'Роли',
    align: 'center',
    render: (value, record) => <RolesAction providerUsers={record} />,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <Action providerUsers={record} />,
  },
];

export const userRolesModal: ColumnType<IUser>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => <span>{index + 1}</span>,
  },
  {
    title: 'Название роли',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
];
