import React from 'react';
import {Avatar, ColorPicker, Image, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IMainStorekeeperProductList, IWarehouseProductStatus} from '@/api/mainStorekeeper/types';
import {Action, WarehouseProductDetailsAction} from './Action';

export const mainstorekeeperWarehouseProductsDetailsColumn: ColumnType<IMainStorekeeperProductList>[] =
  [
    {
      title: '#',
      key: '#',
      dataIndex: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Продукт',
      align: 'center',
      render: (value, record) => (
        <div style={{display: 'flex', gap: '10px'}}>
          <Image
            src={`${
              record?.images?.length
                ? imgStages?.apiUrl + record?.images[0]
                : '/no-photo.png'
            }`}
            width={60}
            height={40}
          />

          <div>
            <Typography.Title
              style={{margin: 0, textAlign: 'left'}}
              level={5}
            >
              {record?.model?.name}
            </Typography.Title>
            <Typography.Text>
              {record?.category?.title} - {record?.direction?.title}
            </Typography.Text>
          </div>
        </div>
      ),
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
          {record?.tissue?.name && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {record?.tissue?.name} -&nbsp;
              <ColorPicker disabled defaultValue={record?.tissue?.hexColor} />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Склад',
      key: 'warehouse',
      dataIndex: 'warehouse',
      align: 'center',
      render: (value, record) => <span>{record?.warehouse?.name}</span>,
    },
    {
      title: 'Кол-во',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
      render: (value, record) => <span>{record?.quantity}</span>,
    },
    {
      title: 'В процессе',
      key: 'processCount',
      dataIndex: 'processCount',
      align: 'center',
      render: (value, record) => <span>{record?.processCount}</span>,
    },
    {
      title: 'Мин. остаток',
      key: 'minQuantity',
      dataIndex: 'minQuantity',
      align: 'center',
      render: (value, record) => <span>{record?.minQuantity}</span>,
    },
    {
      title: 'Изменить статус',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (value, record) => (
        <WarehouseProductDetailsAction productAction={record} />
      ),
    },
  ];

export const mainstorekeeperWarehouseProductsColumn: ColumnType<IMainStorekeeperProductList>[] =
  [
    {
      title: '#',
      key: '#',
      dataIndex: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      title: 'ИД Товара',
      key: 'partId',
      dataIndex: 'partId',
      align: 'center',
      render: (value) => <span>{value}</span>,
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Продукт',
      align: 'center',
      render: (value, record) => (
        <div style={{display: 'flex', gap: '10px'}}>
          <Image
            src={`${
              record?.images?.length
                ? imgStages?.apiUrl + record?.images[0]
                : '/no-photo.png'
            }`}
            width={60}
            height={40}
          />

          <div>
            <Typography.Title
              style={{margin: 0, textAlign: 'left'}}
              level={5}
            >
              {record?.name} - {record?.category?.title}
            </Typography.Title>
            <Typography.Text>
              {record?.model?.name} - {record?.direction?.title}
            </Typography.Text>
          </div>
        </div>
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
            {record?.tissue?.tissue?.name}
          </span>
          {record?.tissue?.name && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {record?.tissue?.name} -&nbsp;
              <ColorPicker disabled defaultValue={record?.tissue?.hexColor} />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Склад',
      key: 'warehouse',
      dataIndex: 'warehouse',
      align: 'center',
      render: (value, record) => <span>{record?.warehouse?.name}</span>,
    },
    {
      title: 'Кол-во',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
      render: (value, record) => <span>{record?.quantity}</span>,
    },

    {
      title: 'Изменить статус',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (value, record) => <Action productAction={record} />,
    },
  ];

export const changeStatusOptions: Record<IWarehouseProductStatus, any> = {
  [IWarehouseProductStatus.ACTIVE]: [
    {
      value: IWarehouseProductStatus.DEFECTED,
      label: IWarehouseProductStatus.DEFECTED,
    },
    {
      value: IWarehouseProductStatus.UPLOADED,
      label: IWarehouseProductStatus.UPLOADED,
    },
  ],
  [IWarehouseProductStatus.DEFECTED]: [
    {
      value: IWarehouseProductStatus.ACTIVE,
      label: IWarehouseProductStatus.ACTIVE,
    },
    {
      value: IWarehouseProductStatus.UPLOADED,
      label: IWarehouseProductStatus.UPLOADED,
    },
  ],
  [IWarehouseProductStatus.UPLOADED]: undefined,
  [IWarehouseProductStatus.BOOKED]: undefined,
};
