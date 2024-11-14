
import React from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Col, Popconfirm} from 'antd';
import {IUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {pmProviderStore} from '@/stores/productManager';
import {addNotification} from '@/utils';

type Props = {
  provider: IUser;
};

export const Action = observer(({provider}: Props) => {
  const queryClient = useQueryClient();

  const {mutate: deleteProvider} =
  useMutation({
    mutationKey: ['deleteProvider'],
    mutationFn: (id: string) => usersApi.deleteProvider(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getManagerProvider']});
    },
    onError: addNotification,
  });


  const handleDelete = () => {
    deleteProvider(provider?.id);
  };

  const handleEdit = () => {
    pmProviderStore.setSingleProvider(provider);
    pmProviderStore.setIsOpenAddEditProviderModal(true);
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
