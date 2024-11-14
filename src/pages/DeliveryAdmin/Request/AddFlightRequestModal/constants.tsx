import React from 'react';
import {Link} from 'react-router-dom';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IOpenRequest} from '@/api/dmsRequest/types';
import {ROUTES} from '@/constants';
import {getFullDateFormat} from '@/utils/getDateFormat';

export const addFlightRequestCol: ColumnType<IOpenRequest>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'nomer',
    dataIndex: 'nomer',
    title: '№ заявки',
    align: 'center',
    render: (value, record) => record?.requestId,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус заявки',
    align: 'center',
    render: (value, record) => <Tag>{record?.status}</Tag>,
  },
  {
    key: 'deadline',
    dataIndex: 'deadline',
    title: 'Срок доставки',
    align: 'center',
    render: (value, record) => <span>{getFullDateFormat(record?.deliveryDate)}</span>,
  },
  {
    key: 'from',
    dataIndex: 'from',
    title: 'От куда',
    align: 'center',
    render: (value, record) => <span>{record?.from?.name} </span>,
  },
  {
    key: 'to',
    dataIndex: 'to',
    title: 'Куда',
    align: 'center',
    render: (value, record) => <span>{record?.to}</span>,
  },
  {
    key: 'info',
    dataIndex: 'info',
    title: 'Более',
    align: 'center',
    render: (value, record) => (
      <Link to={`${ROUTES.dmsCreateFlight?.replace(':requestId', record?.id!)}`}>
        <Button icon={<PlusOutlined />} type="link" />
      </Link>
    ),
  },
];
