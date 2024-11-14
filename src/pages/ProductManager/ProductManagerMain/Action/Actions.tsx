import React, {FC, useState} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {pmProductApi} from '@/api/PmProduct/pmProducts';
import {IProductList} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';

type Props = {
  product: IProductList;
};

export const Actions: FC<Props> = observer(({product}) => {
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const {mutate: deleteProductFunc} = useMutation({
    mutationFn: () => pmProductApi.deleteProduct(product?.id),
    onSuccess: () => {
      addNotification('Выполнено успешно');
      queryClient.invalidateQueries({queryKey: ['getPmProductList']});
    },
    onError: addNotification,
    onSettled: async () => {
      setDeleteLoading(false);
    },
  });

  const handleEditProduct = () => {
    productListStore.setEditProduct(product);
    productManagerStore.setIsProductManagerModal(true);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    deleteProductFunc();
  };

  return (
    <>
      <Button
        loading={deleteLoading}
        type="primary"
        icon={<EditOutlined />}
        onClick={handleEditProduct}
      />
      <Popconfirm
        title="Удалить продукт"
        description="Вы уверены, что удалите этот продукт?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </>
  );
});
