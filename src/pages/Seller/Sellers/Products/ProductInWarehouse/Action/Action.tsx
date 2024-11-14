import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {AxiosResponse} from 'axios';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISellerAddProductToBasketParams} from '@/api/seller/sellerSaleAndOrder/types';
import {sellerProductStore} from '@/stores/seller';
import {addNotification} from '@/utils';

type Props = {
  product: IMainStorekeeperProductList;
};

export const Action: FC<Props> = observer(({product}) => {
  const queryClient = useQueryClient();

  const {mutate: addToBasket, isPending: loading} =
  useMutation({
    mutationKey: ['addToBasket'],
    mutationFn: (params: ISellerAddProductToBasketParams) => sellerSaleAndOrderApi.addProductToBasket(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMainStProduct']});
        addNotification('Успешное добавление товара в корзину');
      }
    },
    onError: addNotification,
  });

  const handleSaveToBasket = () => {
    if (product?.quantity === 1) {
      addToBasket({
        quantity: 1,
        wmsProductId: product?.id,
        partId: product?.partId,
        fromWarehouse: true,
        productId: product?.wmsProductId!,
      });
    } else if (product?.quantity > 1){
      sellerProductStore.setSingleWarehouseProducts(product);
      sellerProductStore.setIsOpenSaveToBasketWarehouseProductModal(true);
    } else {
      addNotification('Проверить количество товара');
    }
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onClick={handleSaveToBasket}
        type="primary"
        icon={<ShoppingCartOutlined />}
        loading={loading}
      />
    </div>
  );
});
