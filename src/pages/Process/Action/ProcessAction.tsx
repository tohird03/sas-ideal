import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IProcess} from '@/api/process/types';
import {processStore} from '@/stores/process';
import {addNotification} from '@/utils';

type Props = {
  process: IProcess;
};

export const ProcessAction: FC<Props> = observer(({process}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteProcess} =
  useMutation({
    mutationKey: ['deleteProcess'],
    mutationFn: (id: string) => processStore.deleteProcess(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProcess']});
    },
    onError: addNotification,
  });

  const handleEditProcess = () => {
    processStore.setIsOpenNewProcessModal(true);
    processStore.setSingleProcess(process);
  };

  const handleDelete = () => {
    deleteProcess(process?.id);
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
