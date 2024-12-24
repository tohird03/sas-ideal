import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Tooltip} from 'antd';
import {clientsInfoApi} from '@/api/clients';
import {addNotification} from '@/utils';
import { IIncomeOrder } from '@/api/income-products/types';
import { incomeProductsStore } from '@/stores/products';

type Props = {
  order: IIncomeOrder;
};

export const Action: FC<Props> = observer(({order}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteSupplier} =
  useMutation({
    mutationKey: ['deleteSupplier'],
    mutationFn: (id: string) => clientsInfoApi.deleteUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getIncomeOrders']});
    },
    onError: addNotification,
  });

  const handleShowOrder = () => {
    incomeProductsStore.setsingleIncomeOrder(order);
    incomeProductsStore.setIsOpenShowIncomeOrderModal(true);
  };

  const handleEditProcess = () => {
    incomeProductsStore.setsingleIncomeOrder(order);
    incomeProductsStore.setIncomeOrder(order);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(true);
  };

  const handleDelete = () => {
    deleteSupplier(order?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Tooltip placement="top" title="Tushurilgan mahsulotni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
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
