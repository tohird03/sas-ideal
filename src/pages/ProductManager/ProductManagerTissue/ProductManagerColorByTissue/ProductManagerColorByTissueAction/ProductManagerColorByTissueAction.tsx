import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IGetManagerTissueList, IPatchManagerTissue} from '@/api/productmanager/tyes';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';

type Props = {
  data: IGetManagerTissueList;
};

export const ProductManagerTissueColorAction: FC<Props> = observer(({data}) => {
  const queryClient = useQueryClient();
  const {id} = useParams();
  const handleEdit = () => {
    productManagerStore.setIsOpenTissueColorAddEditModal(true);
    productManagerStore.setIsEditTissueColorProduct(data);
  };


  const {mutate: deleteColorByTissue} = useMutation({
    mutationFn: (params: IPatchManagerTissue) =>
      productManagerStore.patchTissue(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['getColorByTissue']});
    },
    onError: addNotification,
  });

  const handleDelete = () => {
    deleteColorByTissue({
      id,
      tissueColorsToDisconnect: [data?.id!],
    });
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEdit} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить ткань цвет"
        description="Вы уверены, что хотите удалить этого ткань цвет?"
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
