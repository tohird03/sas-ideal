import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {IProcess} from '@/api/process/types';
import {IProcessUpdateProcesses} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';
import {addNotification} from '@/utils';

type Props = {
  data: IProcess;
};

export const ProcessTableAction: FC<Props> = observer(({data}: Props) => {
  const queryClient = useQueryClient();
  const {id} = useParams();

  const {mutate: deleteProcessWorkOn} = useMutation({
    mutationFn: (params: IProcessUpdateProcesses) => productListStore.patchProcessesUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
    },
    onError: addNotification,
  });

  const handleDeleteProcess = () => {
    deleteProcessWorkOn({processesToDisconnect: [data.id!], processId: id});
  };

  return (
    <div>
      <Popconfirm
        title="Удалить продукт"
        description="Вы уверены, что хотите удалить этого продукт?"
        onConfirm={handleDeleteProcess}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});


