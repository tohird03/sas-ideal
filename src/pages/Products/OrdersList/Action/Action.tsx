import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {clientsInfoApi, ISupplierInfo} from '@/api/clients';
import {addNotification} from '@/utils';
import { IOrder } from '@/api/order/types';
import { ordersStore } from '@/stores/products';

type Props = {
  orders: IOrder;
};

export const Action: FC<Props> = observer(({orders}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteSupplier} =
  useMutation({
    mutationKey: ['deleteSupplier'],
    mutationFn: (id: string) => clientsInfoApi.deleteUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getOrders']});
    },
    onError: addNotification,
  });

  const handleEditProcess = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDelete = () => {
    deleteSupplier(orders?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Yetkazib beruvchini o'chirish"
        description="Rostdan ham bu yetkazib beruvchini o'chirishni xohlaysizmi?"
        onConfirm={handleDelete}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
