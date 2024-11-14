import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Tooltip} from 'antd';
import {ICourier} from '@/api/courier/types';
import {usersApi} from '@/api/users/users';
import {addNotification} from '@/utils';

type Props = {
  courier: ICourier;
};

export const Action: FC<Props> = observer(({courier}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteMySeller} =
  useMutation({
    mutationKey: ['deleteMySeller'],
    mutationFn: (id: string) => usersApi.mainSellerDeleteSeller(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCashbox']});
    },
    onError: addNotification,
  });

  const handleDeleteSeller = () => {
    deleteMySeller(courier?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Tooltip placement="bottom" title="Удалить">
        <Popconfirm
          title="Удалить продавец"
          description="Вы уверены, что хотите удалить продавец?"
          onConfirm={handleDeleteSeller}
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
