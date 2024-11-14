import React from 'react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IGetManagerTissueList} from '@/api/productmanager/tyes';
import {ProductManagerTissueColorAction} from './ProductManagerColorByTissueAction/ProductManagerColorByTissueAction';

export const tissueColorTableColumn: ColumnType<IGetManagerTissueList>[] = [
  {
    title: '#',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Имя цвета',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
    render: (value, record) => value,
  },
  {
    title: 'Цвет',
    key: 'hexColor',
    dataIndex: 'hexColor',
    align: 'center',
    render: (value, record) => (
      <div
        style={{
          width: '80px',
          height: '25px',
          borderRadius: '2px',
          backgroundColor: value,
          margin: '0 auto',
        }}
      />
    ),
  },
  {
    title: 'ДЕЙСТВИЯ',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => <ProductManagerTissueColorAction data={record} />,
  },
];
