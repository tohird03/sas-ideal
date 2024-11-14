import React, {useCallback} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {Button, Col, Popconfirm} from 'antd';
import {IBase} from '@/api/base/types';
import {basesStore} from '@/stores/base/base';

type Props = {
  data: IBase;
};

export const BasesAction = observer(({data}: Props) => {
  const queryClient = useQueryClient();

  const handleDelete = useCallback(() => {
    basesStore.deleteBases(data?.id)
      .then(() => {
        queryClient.invalidateQueries({queryKey: ['getBases']});
      });
  }, [data?.id, basesStore, queryClient]);

  const handleEdit = () => {
    basesStore.setIsOpenAddBaseModal(true);
    basesStore.setEditBase(data);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button type="primary" onClick={handleEdit} icon={<EditOutlined />} />
      <Col span={2} offset={2}>
        <Popconfirm
          title="Удалить пользователя"
          description="Вы уверены, что хотите удалить этого пользователя?"
          onConfirm={handleDelete}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Col>
    </div>
  );
});
