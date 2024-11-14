import React from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import classNames from 'classnames/bind';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {IProductList} from '@/api/product_list/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';
import styles from '../cart.scss';

const cn = classNames.bind(styles);

type IProductActionType = {
  productAction: IProductList;
};

export const Action = observer(({productAction}: IProductActionType) => {
  const queryClient = useQueryClient();

  const {mutate: deleteProductFromCart} =
    useMutation({
      mutationKey: ['deleteProductFromCart'],
      mutationFn: (cartId: string) => mainStorekeeperApi.deleteProductFromCart(cartId),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCartProductList']});
        addNotification('Успешное удаление продукта');
      },
      onError: addNotification,
    });

  const handleOpenChangeStatusModal = () => {
    mainStorekeeperStore.setSingleCartProduct(productAction);
    mainStorekeeperStore.setIsOpenChangeStatusCartProduct(true);
  };

  const handleDeleteProductFromThisCart = () => {
    deleteProductFromCart(productAction?.cartId!);
  };

  return (
    <div className={cn('cart__action-wrapper')}>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={handleOpenChangeStatusModal}
      />

      <Popconfirm
        title="Удалить товар из этой корзины"
        description="Вы хотите удалить товар из этой корзины?"
        onConfirm={handleDeleteProductFromThisCart}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </div>
  );
});
