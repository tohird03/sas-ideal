import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { IClientsPayments } from '@/api/payment/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IDeed } from '@/api/clients';
import { ArrowRightOutlined } from '@ant-design/icons';

export const deedColumns: ColumnType<IDeed>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      record?.type === 'order'
        ? getFullDateFormat(record?.createdAt)
        : getFullDateFormat(record?.updatedAt)
    ),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    align: 'center',
    width: '150px',
    render: (value, record) => (
      record?.type === 'order'
        ? `Sotuv ${<ArrowRightOutlined />} №: ${record?.articl}`
        : `Qarzga to'lov ${<ArrowRightOutlined />} №: ${record?.id}`
    ),
  },
];
