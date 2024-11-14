import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IProductList} from '@/api/product_list/types';
import {sellerProductStore} from '@/stores/seller';

type Props = {
  product: IProductList;
};

export const Action: FC<Props> = observer(({product}) => {

  const handleSaveToBasket = () => {
    sellerProductStore.setSingleNewProduct(product);
    sellerProductStore.setIsOpenSaveToBasketNewProductModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleSaveToBasket} type="primary" icon={<ShoppingCartOutlined />} />
    </div>
  );
});
