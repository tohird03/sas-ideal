import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EditOutlined, MoreOutlined, StopOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {promotionApi} from '@/api/promotion';
import {IPromotion} from '@/api/promotion/types';
import {ROUTES} from '@/constants';
import {promotionStore} from '@/stores/marketer';
import {addNotification} from '@/utils';

type Props = {
  promotion: IPromotion;
};

export const Action: FC<Props> = observer(({promotion}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {mutate: stopPromotion} =
  useMutation({
    mutationKey: ['stopPromotion'],
    mutationFn: (id: string) => promotionApi.stopPromotion(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getPrmotion']});
    },
    onError: addNotification,
  });

  const handleEditPromotion = () => {
    promotionStore.setSinglePromotion(promotion);
    promotionStore.setIsOpenAddEditPromotion(true);
  };

  const handleDelete = () => {
    stopPromotion(promotion.id);
  };

  const handleReloadMorePromotion = () => {
    navigate(ROUTES.marketerSinglePromotion.replace(':promotionId', promotion?.id));
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditPromotion} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить акция"
        description="Вы уверены, что хотите удалить этого акция?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<StopOutlined />} danger />
      </Popconfirm>
      <Button onClick={handleReloadMorePromotion} type="primary" icon={<MoreOutlined />} />
    </div>
  );
});
