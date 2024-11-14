import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined, MoreOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IGetManagerTissueList} from '@/api/productmanager/tyes';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';

type Props = {
  data: IGetManagerTissueList;
};

export const ProductManagerTissueAction: FC<Props> = observer(({data}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleEdit = () => {
    productManagerStore.setIsOpenTissueAddEditModal(true);
    productManagerStore.setIsEditTissueProduct(data);
  };

  const {mutate: deleteTissue} = useMutation({
    mutationKey: ['deleteTissue'],
    mutationFn: (id: string) => productManagerStore.deleteTissue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getTissue']});
    },
    onError: addNotification,
  });

  const handleDelete = () => {
    deleteTissue(data.id!);
  };

  const handleMore = () => {
    navigate(`/productmanager/${data?.id}`);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEdit} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить ткань"
        description="Вы уверены, что хотите удалить этого ткань?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
      <Button onClick={handleMore} icon={<MoreOutlined />} />
    </div>
  );
});
