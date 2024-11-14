import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {AxiosResponse} from 'axios';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISellerBasketProducts} from '@/api/seller/sellerSaleAndOrder/types';
import {sellerStore} from '@/stores/seller';
import {addNotification} from '@/utils';

type PropsType = {
  product: ISellerBasketProducts;
};

export const Action: FC<PropsType> = observer(({product}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteBasketProduct} =
  useMutation({
    mutationKey: ['deleteBasketProduct'],
    mutationFn: (id: string) => sellerSaleAndOrderApi.deleteBasketProducts(id!),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        addNotification('Успешное удаление продукта из корзины');
        queryClient.invalidateQueries({queryKey: ['getBasketProducts']});
      }
    },
    onError: addNotification,
  });

  const handleOpenEditBasketProductModal = () => {
    sellerStore.setSellerSingleBasketModal(product);
    sellerStore.setIsOpenBasketProductUpdateModal(true);
  };

  const handleDeleteBasketProducts = () => {
    deleteBasketProduct(product?.product?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleOpenEditBasketProductModal} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить товар из корзины"
        description="Вы уверены, что этот товар удалить из корзины?"
        onConfirm={handleDeleteBasketProducts}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
