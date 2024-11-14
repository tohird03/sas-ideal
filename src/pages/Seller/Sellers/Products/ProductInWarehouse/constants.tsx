import React from 'react';
import {ColorPicker, Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IMainStorekeeperProductList, warehouseProductStatusColor} from '@/api/mainStorekeeper/types';
import {Action} from './Action';

export const productInWarehouseColumns: ColumnType<IMainStorekeeperProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'productId',
    dataIndex: 'productId',
    title: 'ID товара',
    align: 'center',
    render: (value, record) => record?.partId,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px'}}>
        {record?.images
          && <Image src={`${imgStages?.apiUrl}${record?.images}`} width={80} height={40} />
        }
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.name} - {record?.category?.title}
          </Typography.Title>
          <Typography.Text>{record?.model?.name} - {record?.direction?.title}</Typography.Text>
        </div>
      </div>
    ),
  },
  {
    key: 'tissue',
    dataIndex: 'tissue',
    title: 'Ткань',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.tissue
          ? (
            <>
              <div>
                <Typography.Title
                  style={{margin: 0, textAlign: 'left'}}
                  level={5}
                >
                  {record?.tissue?.tissue?.name}
                </Typography.Title>
                <Typography.Text>{record?.tissue?.name}</Typography.Text>
              </div>
              <ColorPicker value={record?.tissue?.hexColor} disabled />
            </>
          )
          : '-'
        }
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag color={warehouseProductStatusColor[record?.productStatus?.name]}>
        {record?.productStatus?.name}
      </Tag>
    ),
  },
  {
    title: 'Кол-во',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    title: 'Склад',
    key: 'warehouse',
    dataIndex: 'warehouse',
    align: 'center',
    render: (value, record) => <span>{record?.warehouse?.name}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действия',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
