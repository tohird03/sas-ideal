import React from 'react';
import {Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import classNames from 'classnames/bind';
import {ICashbox} from '@/api/cashbox/types';
import {imgStages} from '@/api/endpoints';
import {formatNumber} from '@/utils/formatInputNumber';
import {Action} from './Action';
import styles from './cashbox.scss';

const cn = classNames.bind(styles);

export const cashboxColumns: ColumnType<ICashbox>[] = [
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
    title: 'Наименование',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'cashier',
    dataIndex: 'cashier',
    title: 'Кассир',
    align: 'center',
    render: (value, record) => (
      <div className={cn('cashbox__table-cashier')}>
        {record?.cashier?.avatar &&
          <Image src={`${imgStages?.apiUrl}${record?.cashier?.avatar}`} width={50} height={50} />
        }
        <div>
          <Typography.Title style={{margin: 0}} level={4}>
            {record?.cashier?.firstName || ''}
            {record?.cashier?.lastName || ''}
          </Typography.Title>
          <Typography.Paragraph className={cn('cashbox__table-paragraph')}>
            +{record?.cashier?.phone || ''}
          </Typography.Paragraph>
        </div>
      </div>
    ),
  },
  {
    key: 'balance',
    dataIndex: 'balance',
    title: 'Деньги на кассе',
    align: 'center',
    render: (value, record) => <span>{formatNumber(record?.balance)} сум</span>,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: 'Источники',
    align: 'center',
    width: '250px',
    render: (value, record) => (
      <span>
        {record?.sources?.map(source => <Tag color="blue" key={source?.id}>{source?.name}</Tag>)}
      </span>
    ),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action cashbox={record} />,
  },
];
