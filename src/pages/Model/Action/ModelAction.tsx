import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IModel} from '@/api/model/types';
import {modelStore} from '@/stores/model';
import {addNotification} from '@/utils';

type Props = {
  model: IModel;
};

export const ModelAction: FC<Props> = observer(({model}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteModel} =
  useMutation({
    mutationKey: ['deleteModel'],
    mutationFn: (id: string) => modelStore.deleteModel(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getModel']});
    },
    onError: addNotification,
  });

  const handleEditProcess = () => {
    modelStore.setIsOpenNewModel(true);
    modelStore.setSingleModel(model);
  };

  const handleDelete = () => {
    deleteModel(model?.id!);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить процесс"
        description="Вы уверены, что хотите удалить этого процесс?"
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
