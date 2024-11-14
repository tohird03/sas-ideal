
import React from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IUser} from '@/api/users/types';
import {myUsersStore} from '@/stores/provider';

type Props = {
  providerUsers: IUser;
};

export const Action = observer(({providerUsers}: Props) => {

  const handleEdit = () => {
    myUsersStore.setSingleUser(providerUsers);
    myUsersStore.setIsOpenAddEditUserModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button type="primary" onClick={handleEdit} icon={<EditOutlined />} />
    </div>
  );
});
