import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IConnectedProducts, IProductUpdateWorkOn} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';
import {addNotification} from '@/utils';

type Props = {
  data: IConnectedProducts;
};

export const ProductTableAction: FC<Props> = observer(({data}: Props) => {
  const queryClient = useQueryClient();
  const {id} = useParams();

  const {mutate: deleteProductWorkOn} = useMutation({
    mutationFn: (params: IProductUpdateWorkOn) => productListStore.patchProductUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
    },
    onError: addNotification,
  });

  const handleDeleteProduct = () => {
    deleteProductWorkOn({productsToDelete: [data.id!], productId: id});
  };

  return (
    <div>
      <Popconfirm
        title="Удалить продукт"
        description="Вы уверены, что хотите удалить этого продукт?"
        onConfirm={handleDeleteProduct}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});


