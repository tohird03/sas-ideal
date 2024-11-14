import React from 'react';
import {observer} from 'mobx-react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IProductList} from '@/api/product_list/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';

type IProductActionType = {
  productAction: IProductList;
};

export const Action = observer(({productAction}: IProductActionType) => {

  const handleSaveToCorzinka = () => {
    mainStorekeeperStore.setSingleCreateProduct(productAction);
    mainStorekeeperStore.setIsOpenChangeStatusCreateProduct(true);
  };

  return (
    <Button
      type="primary"
      icon={<ShoppingCartOutlined />}
      onClick={handleSaveToCorzinka}
    />
  );
});
