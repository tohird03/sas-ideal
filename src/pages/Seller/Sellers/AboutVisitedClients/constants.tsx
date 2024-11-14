import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IVisitedClients} from '@/api/seller/sellerVisitedClients/types';
import {getFullDateFormat} from '@/utils/getDateFormat';

export const rewardColumns: ColumnType<IVisitedClients>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: 'Дата',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Клиент',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{margin: 0, fontWeight: 'bold'}}>
          {record?.client?.name}
        </p>
        <p style={{margin: 0}}>
          {record?.client?.phone}
        </p>
      </div>),
  },
  {
    key: 'from',
    dataIndex: 'from',
    title: 'От куда',
    align: 'center',
    render: (value, record) => <span>{record?.client?.clientFrom?.name}</span>,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag color={record?.isBought ? 'green' :'red'}>{record?.isBought ? 'Купил' : 'Не купил'}</Tag>
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Примечание',
    align: 'center',
    render: (value, record) => <span>{record?.note}</span>,
  },
];
