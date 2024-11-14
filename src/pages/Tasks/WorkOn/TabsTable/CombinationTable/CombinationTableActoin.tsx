import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {ICombinationWorkOn} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';
import {addNotification} from '@/utils';

type Props = {
  data: any;
};

export const CombinationTableAction: FC<Props> = observer(({data}: Props) => {
  const queryClient = useQueryClient();
  const {id} = useParams();

  const {mutate: deleteBaseWorkOn} = useMutation({
    mutationFn: (params: ICombinationWorkOn) => productListStore.patchCombinationUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
    },
    onError: addNotification,
  });

  const handleDeleteCombination = () => {
    deleteBaseWorkOn({combinationsToDisconnect: [data.id!], combinationId: id});
  };

  return (
    <div>
      <Popconfirm
        title="Удалить База"
        description="Вы уверены, что хотите удалить этого База?"
        onConfirm={handleDeleteCombination}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});


