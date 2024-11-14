import React from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import classNames from 'classnames/bind';
import {ILocation} from '@/api/locations/types';
import {locationsStore} from '@/stores/dms';
import {addNotification} from '@/utils';
import styles from '../locations.scss';

const cn = classNames.bind(styles);

type Props = {
  location: ILocation;
};

export const Actions = observer(({location}: Props) => {
  const queryClient = useQueryClient();

  const {mutate: deleteLocation} =
  useMutation({
    mutationKey: ['deleteLocation'],
    mutationFn: (id: string) => locationsStore.deleteLocation(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getLocations']});
    },
    onError: addNotification,
  });

  const handleEditLocation = () => {
    locationsStore.setSingleLocation(location);
    locationsStore.setIsOpenAddEditLocationModal(true);
  };

  const handleDeleteLocation = () => {
    deleteLocation(location?.id);
  };

  return (
    <div className={cn('locations__action-warepper')}>
      <Button
        icon={<EditOutlined />}
        onClick={handleEditLocation}
      />
      <Popconfirm
        title="Удалить локации"
        description="Вы уверены, что хотите удалить этого локации?"
        onConfirm={handleDeleteLocation}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
