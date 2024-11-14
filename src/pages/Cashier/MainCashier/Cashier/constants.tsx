import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Avatar, Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {ICashier} from '@/api/cashier/types';
import {imgStages} from '@/api/endpoints';
import {Action} from './Action';

export const providerListColumns: ColumnType<ICashier>[] = [
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
        {`${record?.firstName || ''} ${record?.lastName || ''}`}
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
    key: 'cashbox',
    dataIndex: 'cashbox',
    title: 'Кассы',
    align: 'center',
    render: (value, record) => (
      <span>
        {record?.cashboxs?.map(cashbox => <Tag color="blue" key={cashbox?.id}>{cashbox?.name}</Tag>)}
      </span>
    ),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <Action cashier={record} />,
  },
];
