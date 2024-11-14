import React from 'react';
import {ColumnType} from 'antd/es/table';
import {IProductList} from '@/api/product_list/types';
import {
  IGetProductManagerMainSets,
  IProductManagerTabStatus,
} from '@/api/productmanager/tyes';
import {priceFormat} from '@/utils/priceFormat';
import {Actions} from './Action/Actions';
import {ProductManagerProductColumnComp} from './ProductManagerColumnComponents/ProductManagerProductColumnComp';
import {ProductManagerProviderColumnComp} from './ProductManagerColumnComponents/ProductManagerProviderColumnComp';
import {ProductManagerTissueColumnComp} from './ProductManagerColumnComponents/ProductManagerTissueColumnComp';
import {ProductManagerMainProductTable} from './ProductManagerMainProductTable';
import {ProductManagerMainSetsTable} from './ProductManagerMainSetsTable/ProductManagerMainSetsTable';

export const productManagerMainTitle: Record<IProductManagerTabStatus, string> = {
  [IProductManagerTabStatus.Product]: 'Продукты',
  [IProductManagerTabStatus.Sets]: '',
};


export const ProductManagerMainTabs = [
  {
    key: IProductManagerTabStatus.Product,
    label: productManagerMainTitle[IProductManagerTabStatus.Product],
    children: <ProductManagerMainProductTable />,
  },
  {
    key: IProductManagerTabStatus.Sets,
    label: productManagerMainTitle[IProductManagerTabStatus.Sets],
    children: <ProductManagerMainSetsTable />,
  },
];

export const productManagerMainProductColumn: ColumnType<IProductList>[] = [
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
    width: 400,
    render: (value, record) =>
      (
        <ProductManagerProductColumnComp
          name={record?.name}
          images={record?.images[0]}
          modelName={record?.model?.name}
          categoryName={record?.category?.title}
          directionName={record?.direction?.title}
        />
      ),
  },
  {
    key: 'tissue',
    dataIndex: 'tissue',
    title: 'Ткань',
    width: 260,
    align: 'center',
    render: (value, record) => (
      <ProductManagerTissueColumnComp
        tissueName={record?.tissueColor?.tissue?.name}
        tissueColorName={record?.tissueColor?.name}
        tissueColor={record?.tissueColor?.hexColor}
      />
    ),
  },
  {
    key: 'provider',
    dataIndex: 'provider',
    title: 'Поставщик',
    align: 'center',
    render: (value, record) => (
      <ProductManagerProviderColumnComp
        providerName={record?.provider?.name}
      />
    ),
  },
  {
    key: 'costPrice',
    dataIndex: 'costPrice',
    title: 'Цена закупа',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.oldPriceFactor?.costPrice || 0)} сум</span>,
  },
  {
    key: 'minPrice',
    dataIndex: 'minPrice',
    title: 'Минимальный расход',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.minPrice || 0)} сум</span>,
  },
  {
    key: 'retailPrice',
    dataIndex: 'retailPrice',
    title: 'Роз. цена',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.oldPriceFactor?.retailPrice || 0)} сум</span>,
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: 'Действия',
    align: 'center',
    render: (value, record) => <Actions product={record} />,
  },
];

export const productManagerMainSetsColumn: ColumnType<IGetProductManagerMainSets>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
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
  },
  {
    key: 'provider',
    dataIndex: 'provider',
    title: 'Поставщик',
    align: 'center',
  },
  {
    key: 'note',
    dataIndex: 'note',
    title: 'Примечание',
    align: 'center',
  },
  {
    key: 'purchasePrice',
    dataIndex: 'purchasePrice',
    title: 'Цена закупа',
    align: 'center',
  },
  {
    key: 'rosePrice',
    dataIndex: 'rosePrice',
    title: 'Роз. цена',
    align: 'center',
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    // render: (_value, record) => (<ProductListAction data={record} />),
  },
];
export const productListMainProductFactorsheetModalColumn: ColumnType<any>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя продукта',
    align: 'center',
  },
  {
    key: 'formula',
    dataIndex: 'formula',
    title: 'Формула',
    align: 'center',
  },
  {
    key: 'percent',
    dataIndex: 'percent',
    title: 'Процент %',
    align: 'center',
  },
];
