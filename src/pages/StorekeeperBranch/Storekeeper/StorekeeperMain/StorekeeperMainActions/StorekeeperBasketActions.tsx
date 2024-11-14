import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {CloseCircleTwoTone, EditTwoTone} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';
import {IStorekeeperCartProduct} from '../../../../../api/storekeeper/types';

type Props = {
  data: IStorekeeperCartProduct;
};

export const StorekeeperBasketActions: FC<Props> = observer(({data}) => {
  const queryClient = useQueryClient();
  const handleOpenEditStatusBasketModal = () => {
    storekeeperStore.setCartProduct(data);
    storekeeperStore.setIsOpenStorekeeperEditStatusBasketModal(true);
  };

  const {mutate: deleteProduct} = useMutation({
    mutationFn: (id: string) =>
      storekeeperApi.deleteProductCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCartProducts']});
      addNotification('Успешно завершено');
    },
    onError: addNotification,
  });

  const handleDeleteProduct = () => {
    deleteProduct(data?.cartId);
  };


  return (
    <>
      <div>
        <Button
          size="large"
          onClick={handleOpenEditStatusBasketModal}
          type="text" icon={
            <EditTwoTone />
          }
        />
        <Button
          size="large"
          type="text" shape="circle"
          onClick={handleDeleteProduct}
          icon={<CloseCircleTwoTone twoToneColor="#F75050" />}
        />
      </div>
    </>
  );
});
