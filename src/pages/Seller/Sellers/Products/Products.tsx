import React from 'react';
import {observer} from 'mobx-react';
import {Tabs} from 'antd';
import {sellerProductStore} from '@/stores/seller';
import {sellerProductsTabOptions} from './constants';

export const SellerProducts = observer(() => {

  const handleChangeProductsTab = () => {
    sellerProductStore.reset();
  };

  return (
    <Tabs
      defaultActiveKey="1"
      items={sellerProductsTabOptions}
      onChange={handleChangeProductsTab}
    />
  );
});
