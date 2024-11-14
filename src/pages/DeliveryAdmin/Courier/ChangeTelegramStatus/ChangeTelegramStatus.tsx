import React from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Switch} from 'antd';
import {courierApi} from '@/api/courier';
import {CourierTgStatus, ICourier, ICourierChangeTgStatus} from '@/api/courier/types';
import {addNotification} from '@/utils';

type Props = {
  courier: ICourier;
};

export const ChangeTelegramStatus = observer(({courier}: Props) => {
  const queryClient = useQueryClient();

  const {mutate: editCourier} =
  useMutation({
    mutationKey: ['editCourier'],
    mutationFn: (params: ICourierChangeTgStatus) => courierApi.editCourierTgStatus(params),
    onSuccess: () => {
      addNotification('Успешное редактирование нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getCouriers']});
    },
    onError: addNotification,
  });

  const handleChangeStatus = (checked: boolean) => {
    editCourier({
      userId: courier?.userId,
      tgStatus: checked ? CourierTgStatus?.Active : CourierTgStatus?.Blocked,
    });
  };

  return (
    <Switch
      disabled={courier?.tgStatus === CourierTgStatus.Disactive}
      defaultChecked={courier?.tgStatus === CourierTgStatus.Active}
      onChange={handleChangeStatus}
    />);
});
