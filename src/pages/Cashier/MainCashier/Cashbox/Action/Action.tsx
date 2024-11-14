import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Tooltip} from 'antd';
import {cashboxApi} from '@/api/cashbox';
import {ICashbox} from '@/api/cashbox/types';
import {cashboxStore} from '@/stores/cashier';
import {addNotification} from '@/utils';

type Props = {
  cashbox: ICashbox;
};

export const Action: FC<Props> = observer(({cashbox}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteCashbox} =
  useMutation({
    mutationKey: ['deleteCashbox'],
    mutationFn: (id: string) => cashboxApi.deleteCashbox(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCashbox']});
    },
    onError: addNotification,
  });

  const handleEditCashbox = () => {
    cashboxStore.setSingleCashbox(cashbox);
    cashboxStore.setIsOpenAddEditCashboxModal(true);
  };

  const handleSpendMoney = () => {
    cashboxStore.setIsOpenSpendMoneyModal(true);
  };

  const handleTransferMoney = () => {
    cashboxStore.setSingleCashbox(cashbox);
    cashboxStore.setIsOpenTransferModal(true);
  };

  const handleDeleteCashbox = () => {
    deleteCashbox(cashbox?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Tooltip placement="bottom" title="Изменить">
        <Button onClick={handleEditCashbox} type="primary" icon={<EditOutlined />} />
      </Tooltip>
      <Tooltip placement="bottom" title="Расход">
        <Button danger onClick={handleSpendMoney} type="primary" icon={<MinusCircleOutlined />} />
      </Tooltip>
      <Tooltip placement="bottom" title="Пополнить">
        <Button style={{background: 'green'}} onClick={handleTransferMoney} type="primary" icon={<PlusCircleOutlined />} />
      </Tooltip>
      <Tooltip placement="bottom" title="Удалить">
        <Popconfirm
          title="Удалить кассу"
          description="Вы уверены, что хотите удалить кассу?"
          onConfirm={handleDeleteCashbox}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Tooltip>
    </div>
  );
});
