import React from 'react';
import {Avatar} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IBase} from '@/api/base/types';
import {imgStages} from '@/api/endpoints';
import {BasesAction} from './Action';

export const basesColumns: ColumnType<IBase>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'images',
    dataIndex: 'images',
    title: 'Изображение',
    align: 'center',
    render: (value) => {
      const firstImage = Array.isArray(value) ? value[0] : value;

      return (
        <Avatar
          style={{cursor: 'pointer'}}
          src={firstImage ? `${imgStages?.apiUrl}${firstImage}` : undefined}
        />
      );
    },

  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Базовое имя',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'baseCategory',
    dataIndex: 'baseCategory',
    title: 'Категория объекта',
    align: 'center',
    render: (value, record) => record?.baseCategory.name,
  },
  {
    key: 'baseUnit',
    dataIndex: 'baseUnit',
    title: 'Единица',
    align: 'center',
    render: (value, record) => record?.unit?.name,
  },
  {
    key: 'index',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <BasesAction data={record} />,
  },
];

