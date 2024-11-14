import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IUser, IUserCompanies} from '@/api/users/types';
import {dateFormat} from '@/utils/getDateFormat';

export const UPLOAD_ACCEPT = 'image/png, image/gif, image/jpeg, image/jpg';
export const ratingTooltipDesc = ['Ужасный', 'Плохой', 'Нормальный', 'Хороший', 'Замечательный'];

export const userCompaniesColumn: ColumnType<IUserCompanies>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => <span>{index + 1}</span>,
  },
  {
    title: 'Название компании',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (value) => <span>{value}</span>,
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

export const userLogsColumns: ColumnType<IUser>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => <span>{index + 1}</span>,
  },
  {
    title: 'Описание',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Дата начала',
    align: 'center',
    render: () => <span>{dateFormat('11.23.2023')}</span>,
  },
];
