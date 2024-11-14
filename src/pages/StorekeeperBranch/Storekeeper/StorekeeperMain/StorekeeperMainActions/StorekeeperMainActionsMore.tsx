import React from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {
  MoreOutlined,
} from '@ant-design/icons';
import {Button} from 'antd';
import {ROUTES} from '@/constants';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';

export const StorekeeperMainMoreAction = observer(() => {
  const navigate = useNavigate();
  const handleOpenMorePage = () => {
    navigate(ROUTES.storekeeperMainMore);
  };

  return (
    <>
      <Button type="primary" onClick={handleOpenMorePage} icon={<MoreOutlined />} />
    </>
  );
});
