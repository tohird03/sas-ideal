import React from 'react';
import {ColumnType} from 'antd/es/table';
import {ICompany} from '@/api/companys/types';
import {CompanyAction} from './Action';

export const companyColumns: ColumnType<ICompany>[] = [
  {
    key: 'id',
    dataIndex: 'id',
    width: '100px',
    title: '№',
    render: (value, record, index) => <>{index + 1}</>,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Компания',
    render: (value) => value,
  },
  {
    key: 'action',
    dataIndex: 'action',
    width: '160px',
    title: 'Действия',
    render: (value, record) => <CompanyAction data={record} />,
  },
];

