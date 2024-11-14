import React from 'react';
import {ColorPicker, Image, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IRequestToWarehouseProducts} from '@/api/storekeeper/types';
import {Action} from './Action';

export const singleRequestColumns: ColumnType<IRequestToWarehouseProducts>[] = [
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
        {record?.images[0]
          && <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={40} />
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
    key: 'provider',
    dataIndex: 'provider',
    title: 'Поставщик',
    align: 'center',
    render: (value, record) => (
      <div>
        <Typography.Title
          style={{margin: 0, textAlign: 'left'}}
          level={5}
        >
          {record?.provider?.name}
        </Typography.Title>
      </div>
    ),
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Количество',
    align: 'center',
    render: (value, record) => <span>{record?.count} шт</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Количество',
    align: 'center',
    render: (value, record) => <Action requestProducts={record} />,
  },
];

