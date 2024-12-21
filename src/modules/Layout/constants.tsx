import React from 'react';
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CodeSandboxOutlined,
  ContactsOutlined,
  ControlOutlined,
  DownloadOutlined,
  HomeOutlined,
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
import { IStaffPerKey } from '@/stores/profile/types';

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
    label: 'Bosh sahifa',
    key: ROUTES.home,
    icon: <HomeOutlined />,
    children: [
      {
        label: <><AppstoreAddOutlined /> Statistika</>,
        key: ROUTES.home,
      },
    ],
  },
  {
    label: 'Mahsulotlar',
    key: ROUTES.products,
    icon: <CodeSandboxOutlined />,
    children: [
      {
        label: <><AppstoreAddOutlined /> Mahsulotlar ro&apos;yxati</>,
        key: ROUTES.productsList,
        roleKey: IStaffPerKey.GET_PRODUCTS,
      },
      {
        label: <><ShoppingCartOutlined /> Sotuvlar ro&apos;yxati</>,
        key: ROUTES.productsOrder,
        roleKey: IStaffPerKey.GET_ORDER,
      },
      {
        label: <><DownloadOutlined /> Tushurilgan mahsulotlar</>,
        key: ROUTES.productsIncome,
        roleKey: IStaffPerKey.GET_INCOME_ORDERS,
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
      {
        label: 'To\'lovlar ro\'yxati',
        key: ROUTES.clientsPayments,
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
