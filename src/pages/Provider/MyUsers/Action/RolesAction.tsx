
import React from 'react';
import {observer} from 'mobx-react';
import {EyeOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IUser} from '@/api/users/types';
import {myUsersStore} from '@/stores/provider';

type Props = {
  providerUsers: IUser;
};

export const RolesAction = observer(({providerUsers}: Props) => {

  const handleShowRoles = () => {
    myUsersStore.setSingleUser(providerUsers);
    myUsersStore.setIsOpenRolesModal(true);
  };

  return (
    <Button
      onClick={handleShowRoles}
      color="cyan"
      type="primary"
      style={{cursor: 'pointer'}}
      icon={<EyeOutlined />}
    />
  );
});
