import './header.scss';

import React from 'react';
import {Link} from 'react-router-dom';
import {observer} from 'mobx-react';
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Dropdown, Layout as AntdLayout, MenuProps, Typography} from 'antd';
import {ROUTES} from '@/constants';
import {useStores} from '@/stores';
import {LogOut} from '../LogOut/LogOut';

type Props = {
  collapsed: boolean;
  onCollapsedClick: () => void;
  isMobile?: boolean;
};

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <LogOut />,
  },
  {
    key: '2',
    label: <Link to={ROUTES.workers}>Мой профайл</Link>,
  },
];

export const Header = observer(({collapsed, onCollapsedClick, isMobile}: Props) => {
  const {authStore} = useStores();

  return (
    <AntdLayout.Header className="header">
      <div className="header__left">
        <Button type="text" onClick={onCollapsedClick}>
          {collapsed
            ? <MenuUnfoldOutlined className="header__icon" />
            : <MenuFoldOutlined className="header__icon" />}
        </Button>
        {isMobile && <span className="layout__logo-text">SAS Ideal</span>}

        <div className="header__profile">
          <Typography.Title level={5} style={{color: 'white', margin: '0'}}>
            {authStore.staffInfo?.username}
          </Typography.Title>
          <Dropdown menu={{items}} placement="bottomRight">
            <Avatar style={{backgroundColor: '#1677FF'}} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </AntdLayout.Header>
  );
});
