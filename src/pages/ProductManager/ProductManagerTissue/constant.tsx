import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IGetManagerTissueList} from '@/api/productmanager/tyes';
import {ProductManagerTissueAction} from './ProductManagerTissueAction/ProductManagerTissueAction';

export const tissueTableColumn: ColumnType<IGetManagerTissueList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (_value, _record, index) => index + 1,
  },
  {
    title: 'Имя Ткань',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    title: 'ДЕЙСТВИЯ',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record, index) => <ProductManagerTissueAction data={record} />,
  },
];
