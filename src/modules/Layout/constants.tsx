import React from 'react';
import {
  ControlOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {ROUTES} from '@/constants';
import {IAppRole, IMenuItems} from './types';

export const appRoles: Record<IAppRole, {name: string, color: string}> = {
  [IAppRole.SuperAdmin]: {
    name: 'Super admin',
    color: 'green',
  },
  [IAppRole.Engeneer]: {
    name: 'Engeneer',
    color: 'pink',
  },
  [IAppRole.ProductManager]: {
    name: 'Product Manager',
    color: 'cyan',
  },
  [IAppRole.Provider]: {
    name: 'Provider',
    color: 'orange',
  },
  [IAppRole.Storekeeper]: {
    name: 'Storekeeper',
    color: 'yellow',
  },
  [IAppRole.MainStorekeeper]: {
    name: 'Main Storekeeper',
    color: 'purple',
  },
  [IAppRole.Seller]: {
    name: 'Seller',
    color: 'volcano',
  },
  [IAppRole.MainSeller]: {
    name: 'Main Seller',
    color: 'magenta',
  },
  [IAppRole.HeadSeller]: {
    name: 'Head Seller',
    color: 'red',
  },
  [IAppRole.DeliveryAdmin]: {
    name: 'Delivery admin',
    color: 'gold',
  },
  [IAppRole.Courier]: {
    name: 'Courier',
    color: 'gold',
  },
};

export const mainMenuList: IMenuItems[] = [
  {
    label: 'Mijozlar',
    key: ROUTES.clients,
    icon: <UserOutlined />,
    roleKey: 'clients',
    children: [
      {
        label: 'Mijozlar ro\'yxati',
        key: ROUTES.clientsInfo,
        icon: <ControlOutlined />,
      },
    ],
  },
  {
    label: 'Xodimlar',
    key: ROUTES.workers,
    icon: <UserOutlined />,
    roleKey: 'staffs',
    children: [
      {
        label: 'Xodimlar ro\'yxati',
        key: ROUTES.workersStaffs,
        icon: <ControlOutlined />,
      },
    ],
  },
];
