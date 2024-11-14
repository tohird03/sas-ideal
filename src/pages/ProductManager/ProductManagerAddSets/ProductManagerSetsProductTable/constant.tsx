import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IGetProductManagerSetsType} from '@/api/productmanager/tyes';


export const productManagerSetsColumn: ColumnType<IGetProductManagerSetsType>[] = [
  {
    title: '#',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Категория',
    key: 'category',
    dataIndex: 'category',
    align: 'center',
    render: (value, record, index) => <span>{value}</span>,
  },
  {
    title: 'Модел',
    key: 'model',
    dataIndex: 'model',
    align: 'center',
    render: (value, record, index) => <span>{value}</span>,
  },
  {
    title: 'Угол',
    key: 'corner',
    dataIndex: 'corner',
    align: 'center',
    render: (value, record, index) => <span>{value}</span>,
  },
  {
    title: 'Цвет ткани',
    key: 'fabric_color',
    dataIndex: 'fabric_color',
    align: 'center',
    render: (value, record, index) => (
      <div
        style={{
          backgroundColor: value,
          width: '80px',
          height: '25px',
          border: '1px solid #ddd',
          display: 'inline-block',
        }}
      />
    ),
  },

  {
    title: 'Кол-во',
    key: 'qty',
    dataIndex: 'qty',
    align: 'center',
    render: (value, record, index) => <span>{value}</span>,
  },
  {
    title: 'Резултать',
    key: 'result',
    dataIndex: 'result',
    align: 'center',
    render: (value, record, index) => <span>{value}</span>,
  },
];
