import React from 'react';
import {ColorPicker, Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {IGetWmsProvidersStorekeeperProductsTypes} from '@/api/wmsProducts/types';
import {Action} from './Action';

export const commonProductsColumns: ColumnType<IMainStorekeeperProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.images![0] &&
          <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={60} />
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
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag>
        {record?.productStatus?.name}
      </Tag>
    ),
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Количество',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'В процессе',
    align: 'center',
    render: (value, record) => <span>{record?.processCount} шт</span>,
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Мин. остаток',
    align: 'center',
    render: (value, record) => <span>{record?.minQuantity} шт</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Производить',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];

export const moreProductsColumns: ColumnType<IMainStorekeeperProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'partId',
    dataIndex: 'partId',
    title: 'ID заказа',
    align: 'center',
    render: (value, record) => record?.partId,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.images![0] &&
          <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={60} />
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
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag>
        {record?.productStatus?.name}
      </Tag>
    ),
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Количество',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
];


export const IProductTabTypesText = {
  [IGetWmsProvidersStorekeeperProductsTypes.Common]: 'Общий',
  [IGetWmsProvidersStorekeeperProductsTypes.Details]: 'Подробно',
};


export const ProductTabsOptions = [
  {
    value: IGetWmsProvidersStorekeeperProductsTypes?.Common,
    label: IProductTabTypesText[IGetWmsProvidersStorekeeperProductsTypes?.Common],
  },
  {
    value: IGetWmsProvidersStorekeeperProductsTypes?.Details,
    label: IProductTabTypesText[IGetWmsProvidersStorekeeperProductsTypes?.Details],
  },
];
