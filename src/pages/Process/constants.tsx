import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IProcess} from '@/api/process/types';
import {formatNumber} from '@/utils/formatInputNumber';
import {ProcessAction} from './Action';

export const processColumns: ColumnType<IProcess>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Название процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'time',
    dataIndex: 'time',
    title: 'Время процесса',
    align: 'center',
    render: (value) => <span>{`${value}`}</span>,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Стоимость процесса',
    align: 'center',
    render: (value) => <span>{formatNumber(value)}</span>,
  },
  {
    key: 'unitAmount',
    dataIndex: 'unitAmount',
    title: 'Количество единиц',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'unit',
    dataIndex: 'unit',
    title: 'Unit',
    align: 'center',
    render: (value, record) => record?.unit?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <ProcessAction process={record} />,
  },
];
