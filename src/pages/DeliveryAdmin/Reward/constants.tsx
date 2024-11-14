import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IClosedFlights} from '@/api/dmsRequest/types';
import {getTimeZoneDate} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';

export const rewardColumns: ColumnType<IClosedFlights>[] = [
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
    title: 'Дата начала',
    align: 'center',
    render: (value, record) => getTimeZoneDate(record?.startDate, -5),
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: 'Дата окончания',
    align: 'center',
    render: (value, record) => getTimeZoneDate(record?.endDate, -5),
  },
  {
    key: 'courier',
    dataIndex: 'courier',
    title: 'Курьер',
    align: 'center',
    render: (value, record) => (
      <div>
        <p>
          <b>
            {record?.courierInfo?.name}
          </b>
        </p>
        <p>
          <b>
            {record?.courierInfo?.phone}
          </b>
        </p>
      </div>),
  },
  {
    key: 'promotion',
    dataIndex: 'promotion',
    title: 'Вознограждение',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.promotion)} сум</span>,
  },
  {
    key: 'deliveryNumber',
    dataIndex: 'deliveryNumber',
    title: 'Количество рейсов',
    align: 'center',
    render: (value, record) => <span>{record?.deliveryCount} шт</span>,
  },
  {
    key: 'info',
    dataIndex: 'info',
    title: 'Более',
    align: 'center',
    render: (value, record) => <Action moreInfo={record} />,
  },
];
