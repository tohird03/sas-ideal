import React from 'react';
import {Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IRequestToWarehouse} from '@/api/storekeeper/types';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {Action} from './Action';

export const requestColumns: ColumnType<IRequestToWarehouse>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: '№ заявки',
    key: 'requestId',
    dataIndex: 'requestId',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    title: 'Оформлено в',
    key: 'createdAt',
    dataIndex: 'createdAt',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    title: 'Статус',
    key: 'productStatus',
    dataIndex: 'productStatus',
    align: 'center',
    render: (value, record) => <Tag>{record?.status}</Tag>,
  },
  {
    title: 'Заявитель',
    key: 'requestr',
    dataIndex: 'requestr',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
        <Image src={`${imgStages.apiUrl}${record?.requester?.avatar}`} />
        <div>
          <Typography.Title
            level={5}
            style={{margin: 0}}
          >
            {`${record?.requester?.firstName || ''} ${record?.requester?.lastName || ''}`}
          </Typography.Title>
          <span>+{record?.requester?.phone}</span>
        </div>
      </div>
    ),
  },
  {
    title: 'От куда',
    key: 'from',
    dataIndex: 'from',
    align: 'center',
    render: (value, record) => <span>{record?.from?.name}</span>,
  },
  {
    title: 'Когда',
    key: 'when',
    dataIndex: 'when',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.deliveryDate),
  },
  {
    title: 'Действия',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => <Action request={record} />,
  },
];
