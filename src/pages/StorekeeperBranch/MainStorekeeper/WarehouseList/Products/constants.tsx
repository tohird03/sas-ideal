import React from 'react';
import {Avatar, ColorPicker} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {Action} from './Action';

export const warehouseProductColumns: ColumnType<IMainStorekeeperProductList>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
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
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    render: (value, record) => (
      <div>
        <span style={{fontWeight: 'bold', display: 'block'}}>
          {record?.tissue?.tissue?.name}
        </span>
        {record?.tissue?.name &&
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {record?.tissue?.name}-
            <ColorPicker
              disabled
              defaultValue={record?.tissue?.hexColor}
            />
          </span>
        }
      </div>
    ),
  },
  {
    key: 'productQty',
    dataIndex: 'productQty',
    title: 'Количество продуктов',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    key: 'proccesQty',
    dataIndex: 'proccesQty',
    title: 'В процессе',
    align: 'center',
    render: (value, record) => <span>{record?.countDay} шт</span>,
  },
  {
    key: 'minAmount',
    dataIndex: 'minAmount',
    title: 'Мин. остаток',
    align: 'center',
    render: (value, record) => <span>{record?.minQuantity} шт</span>,
  },
  {
    title: 'Изменить',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
