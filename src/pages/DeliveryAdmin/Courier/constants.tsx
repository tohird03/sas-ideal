import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import {ColumnType} from 'antd/es/table';
import {ICourier} from '@/api/courier/types';
import {imgStages} from '@/api/endpoints';
import {Action} from './Action';
import {ChangeTelegramStatus} from './ChangeTelegramStatus';

export const courierColumns: ColumnType<ICourier>[] = [
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
    key: 'fullName',
    dataIndex: 'fullName',
    title: 'Полное имя',
    align: 'center',
    render: (value, record) => <span>{record?.firstName} {record?.lastName}</span>,
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Телефон',
    align: 'center',
    render: (value, record) => record?.phone,
  },
  {
    key: 'telegramStatus',
    dataIndex: 'telegramStatus',
    title: 'Телеграм',
    align: 'center',
    render: (value, record) => <ChangeTelegramStatus courier={record} />,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действия',
    align: 'center',
    render: (value, record) => <Action courier={record} />,
  },
];
