import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {expenseTypeApi} from '@/api/expenseType/expenseType';
import {IExpenseType} from '@/api/expenseType/type';
import {pmExpenseStore} from '@/stores/productManager';
import {addNotification} from '@/utils';

type Props = {
  expenseType: IExpenseType;
};

export const Action: FC<Props> = observer(({expenseType}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteExpenseType} =
  useMutation({
    mutationKey: ['deleteExpenseType'],
    mutationFn: (id: string) => expenseTypeApi.deleteExpenseType(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getExpenseType']});
    },
    onError: addNotification,
  });

  const handleEditExpense = () => {
    pmExpenseStore.setSingleExpenseType(expenseType);
    pmExpenseStore.setIsOpenAddEditExpenseModal(true);
  };

  const handleDelete = () => {
    deleteExpenseType(expenseType?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditExpense} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить категория расходов"
        description="Вы уверены, что хотите удалить этого категория расходов?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
