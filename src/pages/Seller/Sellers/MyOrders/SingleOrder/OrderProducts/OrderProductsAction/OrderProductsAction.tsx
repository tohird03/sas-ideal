import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {AxiosResponse} from 'axios';
import {ordersApi} from '@/api/orders';
import {EOrderDetailChangeType, IOrderDetailChangeParams, ISaleOrderProduct} from '@/api/orders/types';
import {sellerStore} from '@/stores/seller';
import {addNotification} from '@/utils';

type Props = {
  product: ISaleOrderProduct;
};

export const OrderProductsAction: FC<Props> = observer(({product}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteMyOrderProduct} =
  useMutation({
    mutationKey: ['deleteMyOrderProduct'],
    mutationFn: (params: IOrderDetailChangeParams) => ordersApi.orderDetailChange(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMySingleOrder']});
        addNotification('Успешное удаление продукта!');
      }
    },
    onError: addNotification,
  });

  const handleEditOrderProduct = () => {
    sellerStore.setSellerSingleOrderDetailsProduct(product);
    sellerStore.setIsOpenOrderDetailsProductUpdateModal(true);
  };

  const handleDeleteProduct = () => {
    deleteMyOrderProduct({
      orderDetailId: product?.id,
      type: EOrderDetailChangeType.Cancel,
    });
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onClick={handleEditOrderProduct}
        type="primary"
        icon={<EditOutlined />}
      />
      <Popconfirm
        title="Удалить продукт"
        description="Вы уверены, что хотите удалить этот товар из заказа?"
        onConfirm={handleDeleteProduct}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          danger
        />
      </Popconfirm>
    </div>
  );
});
