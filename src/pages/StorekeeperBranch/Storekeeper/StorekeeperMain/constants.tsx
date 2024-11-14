import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IStorekeeperCartProduct,
  IStorekeeperMainType,
  IStorekeeperProductType,
  StorekeeperProduct,
} from '@/api/storekeeper/types';
import {StorekeeperProductColumnComp} from './StorekeeperColumnComponents/StorekeeperProductColumnComp';
import {StorekeeperProviderComp} from './StorekeeperColumnComponents/StorekeeperProviderComp';
import {StorekeeperTissueColumn} from './StorekeeperColumnComponents/StorekeeperTissueColumn';
import {StorekeeperAddProductBasketActions} from './StorekeeperMainActions/StorekeeperAddProductBasketActions';
import {StorekeeperBasketActions} from './StorekeeperMainActions/StorekeeperBasketActions';
import {StorekeeperMainActions} from './StorekeeperMainActions/StorekeeperMainActions';

export const ProductTabsOptions = [
  {
    value: IStorekeeperProductType.Common,
    label: 'Общий',
  },
  {
    value: IStorekeeperProductType.Details,
    label: 'Подробно',
  },
];

// storekeeper main column ---
export const storekeeperMainColumn: ColumnType<StorekeeperProduct>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'ИД  товара',
    key: 'partId',
    dataIndex: 'partId',
    align: 'center',
    render: (value) => <span>{value}</span>,
  },
  {
    title: 'Продукт',
    key: 'product',
    dataIndex: 'product',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProductColumnComp
          modelName={record?.model.name}
          categoryName={record?.category?.title}
          images={record?.images?.length ? record?.images[0] : undefined}
        />
      ),
  },
  {
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperTissueColumn
          tissueName={record?.tissue?.tissue?.name}
          tissueColorName={record?.tissue?.name}
          tissueColor={record?.tissue?.hexColor}
        />
      ),
  },
  {
    title: 'Поставщик',
    key: 'supplier',
    dataIndex: 'supplier',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProviderComp
          providerName={record?.provider?.name}
        />
      ),
  },
  {
    title: 'Статус',
    key: 'productStatus',
    dataIndex: 'productStatus',
    align: 'center',
    render: (value, record) => <span>{record?.productStatus?.name}</span>,
  },
  {
    title: 'Количество',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (value, record) => <span>{record?.quantity}</span>,
  },
  {
    title: 'Действия',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => (<StorekeeperMainActions data={record} />),
  },
];

export const storekeeperCommonProductsColumns: ColumnType<StorekeeperProduct>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Продукт',
    key: 'product',
    dataIndex: 'product',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProductColumnComp
          modelName={record?.model.name}
          categoryName={record?.category?.title}
          images={record?.images?.length ? record?.images[0] : undefined}
        />
      ),
  },
  {
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperTissueColumn
          tissueName={record?.tissue?.tissue?.name}
          tissueColorName={record?.tissue?.name}
          tissueColor={record?.tissue?.hexColor}
        />
      ),
  },
  {
    title: 'Статус',
    key: 'productStatus',
    dataIndex: 'productStatus',
    align: 'center',
    render: (value, record) => <Tag>{record?.productStatus?.name}</Tag>,
  },
  {
    title: 'Количество',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    title: 'В процессе',
    key: 'processCount',
    dataIndex: 'processCount',
    align: 'center',
    render: (value, record) => <span>{record?.processCount} шт</span>,
  },
  {
    title: 'Мин. остаток',
    key: 'minQuantity',
    dataIndex: 'minQuantity',
    align: 'center',
    render: (value, record) => <span>{record?.minQuantity} шт</span>,
  },
];

// storekeeperbasket column
export const storekeeperBasketColumn: ColumnType<IStorekeeperCartProduct>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Продукт',
    key: 'product',
    dataIndex: 'product',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProductColumnComp
          modelName={record?.model.name}
          categoryName={record?.category?.title}
          images={record?.images?.length ? record?.images[0] : undefined}
        />
      ),
  },
  {
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperTissueColumn
          tissueName={record?.tissue?.tissue?.name}
          tissueColorName={record?.tissue?.name}
          tissueColor={record?.tissue?.hexColor}
        />
      ),
  },
  {
    title: 'Поставщик',
    key: 'supplier',
    dataIndex: 'supplier',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProviderComp
          providerName={record?.provider?.name}
        />
      ),
  },
  {
    title: 'Статус',
    key: 'productStatus',
    dataIndex: 'productStatus',
    align: 'center',
    render: (value, record) => <span>{record?.productStatus?.name}</span>,
  },
  {
    title: 'Количество',
    key: 'quantity',
    dataIndex: 'quantity',
    align: 'center',
    render: (value, record) => <span>{record?.quantity}</span>,
  },
  {
    title: 'Действия',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => (
      <StorekeeperBasketActions data={record} />
    ),
  },
];

// storekeeper add product basket
export const storekeeperAddProductBasketColumn:
ColumnType<IStorekeeperMainType>[] = [
  {
    title: '#',
    key: '#',
    dataIndex: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Продукт',
    key: 'product',
    dataIndex: 'product',
    align: 'center',
    width: 400,
    render: (value, record) =>
      (
        <StorekeeperProductColumnComp
          directionName={record?.direction?.title}
          modelName={record?.model.name}
          categoryName={record?.category?.title}
          images={record?.images?.length ? record?.images[0] : undefined}
        />
      ),
  },
  {
    title: 'Ткань',
    key: 'tissue',
    dataIndex: 'tissue',
    align: 'center',
    width: 300,
    render: (value, record) =>
      (
        <StorekeeperTissueColumn
          tissueName={record?.tissue?.tissue?.name}
          tissueColorName={record?.tissue?.name}
          tissueColor={record?.tissue?.hexColor}
        />
      ),
  },
  {
    title: 'Поставщик',
    key: 'supplier',
    dataIndex: 'supplier',
    align: 'center',
    render: (value, record) =>
      (
        <StorekeeperProviderComp
          providerName={record?.provider?.name}
        />
      ),
  },
  {
    title: 'Действия',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    render: (value, record) => (
      <StorekeeperAddProductBasketActions data={record} />),
  },
];
