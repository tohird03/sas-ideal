import React from 'react';
import {observer} from 'mobx-react';
import {Modal} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {usersStore} from '@/stores/users';
import {userCompaniesColumn} from '../constants';

export const CompaniesModal = observer(() => {

  const handleModalClose = () => {
    usersStore.setIsOpenCompaniesModal(false);
    usersStore.setSingleUser(null);
  };

  return (
    <Modal
      open={usersStore.isOpenCompaniesModal}
      title={'Компании'}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
    >
      <DataTable
        columns={userCompaniesColumn}
        data={usersStore.singleUser?.companies || []}
        pagination={false}
      />
    </Modal>
  );
});
