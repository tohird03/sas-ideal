import React from 'react';
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CodeSandboxOutlined,
  ContactsOutlined,
  ControlOutlined,
  DownloadOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  UsergroupAddOutlined,
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
    label: 'Mahsulotlar',
    key: ROUTES.products,
    icon: <CodeSandboxOutlined />,
    roleKey: 'products',
    children: [
      {
        label: <><AppstoreAddOutlined /> Mahsulotlar ro&apos;yxati</>,
        key: ROUTES.productsList,
      },
      {
        label: <><ShoppingCartOutlined /> Sotuvlar royxati</>,
        key: ROUTES.productsOrder,
      },
      {
        label: <><DownloadOutlined /> Tushurilgan mahsulotlar</>,
        key: ROUTES.productsIncome,
      },
    ],
  },
  {
    label: 'Mijozlar',
    key: ROUTES.clients,
    icon: <TeamOutlined />,
    roleKey: 'clients',
    children: [
      {
        label: 'Mijozlar ro\'yxati',
        key: ROUTES.clientsInfo,
      },
    ],
  },
  {
    label: 'Yetkazib beruvchilar',
    key: ROUTES.supplier,
    icon: <UsergroupAddOutlined />,
    roleKey: 'supplier',
    children: [
      {
        label: <><ContactsOutlined /> Yetkazib beruvchilar ro&apos;yxati</>,
        key: ROUTES.supplierInfo,
      },
    ],
  },
  {
    label: 'Xodimlar',
    key: ROUTES.workers,
    icon: <SettingOutlined />,
    roleKey: 'staffs',
    children: [
      {
        label: <><SolutionOutlined /> Xodimlar ro&apos;yxati</>,
        key: ROUTES.workersStaffs,
      },
    ],
  },
];
