import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Tooltip } from 'antd';
import { clientsInfoApi, ISupplierInfo } from '@/api/clients';
import { addNotification } from '@/utils';
import { IOrder } from '@/api/order/types';
import { ordersStore } from '@/stores/products';
import { ordersApi } from '@/api/order';

type Props = {
  orders: IOrder;
};

export const Action: FC<Props> = observer(({ orders }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteOrder } =
    useMutation({
      mutationKey: ['deleteOrder'],
      mutationFn: (id: string) => ordersApi.deleteOrder(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      },
      onError: addNotification,
    });

  const handleShowOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setIsOpenShowOrderModal(true);
  };

  const handleEditOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDelete = () => {
    deleteOrder(orders?.id);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip placement="top" title="Sotuvni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
      <Tooltip placement="top" title="Sotuvni tahrirlash">
        <Button onClick={handleEditOrder} type="primary" icon={<EditOutlined />} />
      </Tooltip>
      <Tooltip placement="top" title="Sotuvni o'chirish">
        <Popconfirm
          title="Sotuvni o'chirish"
          description="Rostdan ham bu sotuvni o'chirishni xohlaysizmi?"
          onConfirm={handleDelete}
          okText="Ha"
          okButtonProps={{ style: { background: 'red' } }}
          cancelText="Yo'q"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Tooltip>
    </div>
  );
});
