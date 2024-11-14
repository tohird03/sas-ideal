import React from 'react';
import {ColorPicker, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IProductStatus, ProductStatusColor, ProductStatusText} from '@/api/types';
import {IWarehouseOrders} from '@/api/wmsOrders/types';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {Action} from './Action';

export const applyProductsColumns: ColumnType<IWarehouseOrders>[] = [
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
    title: 'ID заказа',
    align: 'center',
    render: (value, record) => record?.orderId,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px'}}>
        {/* <Image src={record?.images![0]} width={80} height={40} /> */}
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.category?.title}
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
      <Tag color={ProductStatusColor[record?.status!]}>
        {ProductStatusText[record?.status!]}
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
    key: 'deadline',
    dataIndex: 'deadline',
    title: 'Срок',
    align: 'center',
    render: (value, record) => <span>{getFullDateFormat(record?.date)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Изменить статус',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];

export const ProductTabsOptions = [
  {
    value: IProductStatus.ALL,
    label: ProductStatusText[IProductStatus.ALL],
  },
  {
    value: IProductStatus.NEW,
    label: ProductStatusText[IProductStatus.NEW],
  },
  {
    value: IProductStatus.CHECKED,
    label: ProductStatusText[IProductStatus.CHECKED],
  },
  {
    value: IProductStatus.PROCESS,
    label: ProductStatusText[IProductStatus.PROCESS],
  },
  {
    value: IProductStatus.DONE,
    label: ProductStatusText[IProductStatus.DONE],
  },
];

export const ChangeStatusOption = {
  [IProductStatus.NEW]: [
    {
      value: IProductStatus.CHECKED,
      label: ProductStatusText[IProductStatus.CHECKED],
    },
  ],
  [IProductStatus.CHECKED]: [
    {
      value: IProductStatus.PROCESS,
      label: ProductStatusText[IProductStatus.PROCESS],
    },
  ],
};
