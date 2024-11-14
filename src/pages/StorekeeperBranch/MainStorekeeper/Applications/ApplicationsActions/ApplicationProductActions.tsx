import React, {FC, useState} from 'react';
import {CloseCircleTwoTone, EditTwoTone} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

type Props = {
  data: IMainStorekeeperProductList;
};

export const ApplicationProductActions: FC<Props> = ({data}) => {
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const {mutate: deleteProductFunc} = useMutation({
    mutationFn: (id: string) => mainStorekeeperStore.deleteReqProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getByIdProduct']});
      addNotification('Успешно завершено');
    },
    onError: addNotification,
    onSettled: async () => {
      setDeleteLoading(false);
    },
  });

  const handleDelete = () => {
    setDeleteLoading(true);
    deleteProductFunc(data?.id);
  };

  const handleOpenEditModal = () => {
    mainStorekeeperStore.setReqProductQty({
      id: data?.id,
      quantity: data?.quantity,
    });
    mainStorekeeperStore.setIsOpenEditReqProductModal(true);
  };

  return (
    <>
      <div>
        <Button
          disabled={Boolean(data?.quantity !== data?.count)}
          onClick={handleOpenEditModal}
          icon={<EditTwoTone />}
          type="text"
          size="large"
        />
        <Button
          onClick={handleDelete}
          loading={deleteLoading}
          icon={<CloseCircleTwoTone twoToneColor={'#F75050'} />}
          type="text"
          size="large"
        />
      </div>
    </>
  );
};
