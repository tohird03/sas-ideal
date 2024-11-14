import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Modal} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {usersStore} from '@/stores/users';
import {userRolesModal} from '../constants';

export const RolesModal = observer(() => {

  const {data: singleUser, isLoading: loading} = useQuery({
    queryKey: ['getSingleUser', usersStore?.singleUser?.id],
    queryFn: () => usersStore?.getSingleUser(usersStore?.singleUser?.id!),
  });

  const handleModalClose = () => {
    usersStore.setIsOpenRolesModal(false);
  };

  return (
    <Modal
      open={usersStore.isOpenRolesModal}
      title={'Roles'}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
    >
      <DataTable
        columns={userRolesModal}
        data={singleUser?.userRoles || []}
        pagination={false}
        loading={loading}
      />
    </Modal>
  );
});
