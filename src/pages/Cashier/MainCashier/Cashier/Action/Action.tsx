
import React from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Col, Popconfirm} from 'antd';
import {cashierApi} from '@/api/cashier';
import {ICashier} from '@/api/cashier/types';
import {cashierUserStore} from '@/stores/cashier';
import {addNotification} from '@/utils';

type Props = {
  cashier: ICashier;
};

export const Action = observer(({cashier}: Props) => {
  const queryClient = useQueryClient();

  const {mutate: deleteCashier} =
  useMutation({
    mutationKey: ['deleteCashier'],
    mutationFn: (id: string) => cashierApi.deleteCashier(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCashier']});
    },
    onError: addNotification,
  });


  const handleDelete = () => {
    deleteCashier(cashier?.id);
  };

  const handleEdit = () => {
    cashierUserStore.setSingleCashier(cashier);
    cashierUserStore.setIsOpenAddEditCashierModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button type="primary" onClick={handleEdit} icon={<EditOutlined />} />
      <Col span={2} offset={2}>
        <Popconfirm
          title="Удалить поставщик"
          description="Вы уверены, что хотите удалить этого поставщик?"
          onConfirm={handleDelete}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Col>
    </div>
  );
});
