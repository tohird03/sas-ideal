import React from 'react';
import {Avatar, ColorPicker} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IProductList} from '@/api/product_list/types';
import {formatNumber} from '@/utils/formatInputNumber';
import {Action} from './Action';

export const mainStorekeeperProductListColumns: ColumnType<IProductList>[] = [
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
    render: (value) => (
      <Avatar
        style={{cursor: 'pointer'}}
        src={`${imgStages?.apiUrl}${value}`}
      />
    ),
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя продукта',
    align: 'center',
  },
  {
    key: 'category',
    dataIndex: 'category',
    title: 'Категория',
    align: 'center',
    render: (value, record) => record?.category?.title,
  },
  {
    key: 'model',
    dataIndex: 'model',
    title: 'Модель',
    align: 'center',
    render: (value, record) => record?.model.name,
  },
  {
    key: 'provider',
    dataIndex: 'provider',
    title: 'Поставщик',
    align: 'center',
    render: (value, record) => record?.provider.name,
  },
  {
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    render: (value, record) => (
      <div>
        <span style={{fontWeight: 'bold', display: 'block'}}>
          {record?.tissueColor?.tissue?.name}
        </span>
        {record?.tissueColor?.name &&
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {record?.tissueColor?.name}-
            <ColorPicker
              disabled
              defaultValue={record?.tissueColor?.hexColor}
            />
          </span>
        }
      </div>
    ),
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'Кол-во',
    align: 'center',
    render: (value, record) => record?.quantity,
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Общая стоимость',
    align: 'center',
    render: (value) => <span>{formatNumber(value)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <Action productAction={record} />,
  },
];
