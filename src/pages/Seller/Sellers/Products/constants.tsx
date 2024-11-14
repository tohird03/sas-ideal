import React from 'react';
import {TabsProps} from 'antd';
import {NewProducts} from './NewProducts';
import {ProductPrintList} from './PricePrintList';
import {ProductInWarehouse} from './ProductInWarehouse';

export const sellerProductsTabOptions: TabsProps['items'] = [
  {
    key: '1',
    label: 'Товары на складе',
    children: <ProductInWarehouse />,
  },
  {
    key: '2',
    label: 'Новый заказ',
    children: <NewProducts />,
  },
  {
    key: '3',
    label: 'Ценник',
    children: <ProductPrintList />,
  },
];
