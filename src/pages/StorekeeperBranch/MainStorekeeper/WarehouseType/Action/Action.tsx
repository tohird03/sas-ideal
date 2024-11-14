import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {AxiosError} from 'axios';
import {warehouseTypeApi} from '@/api/warehouseType';
import {IWarehouseType} from '@/api/warehouseType/types';
import {warehouseTypeStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

type Props = {
  warehouseType: IWarehouseType;
};

export const Action: FC<Props> = observer(({warehouseType}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteWarehouseType} =
  useMutation({
    mutationKey: ['deleteWarehouseType'],
    mutationFn: (id: string) => warehouseTypeApi.deleteWarehouseType(id!),
    onSuccess: () => {
      addNotification('Успешное удаление типа склада');
      queryClient.invalidateQueries({queryKey: ['getWarehouseType']});
    },
    onError: (error: AxiosError) => {
      addNotification(error);
    },
  });

  const handleEditDirection = () => {
    warehouseTypeStore.setSingleWarehouseType(warehouseType);
    warehouseTypeStore.setIsOpenAddEditWarehouseTypeModal(true);
  };

  const handleDelete = () => {
    deleteWarehouseType(warehouseType?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditDirection} type="primary" icon={<EditOutlined />} />
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
