import React from 'react';
import {
  ApartmentOutlined,
  BankOutlined,
  BarsOutlined,
  CarOutlined,
  ControlOutlined,
  DatabaseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GiftOutlined,
  HistoryOutlined,
  HomeOutlined,
  PartitionOutlined,
  PlusOutlined,
  RadiusSettingOutlined,
  RetweetOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  VerticalAlignBottomOutlined,
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
    label: 'Home',
    key: ROUTES.dashboard,
    icon: <HomeOutlined />,
    roleKey: 'super-admin',
    children: [
      {
        label: 'Users',
        key: ROUTES.users,
        icon: <TeamOutlined />,
      },
      {
        label: 'Companies',
        key: ROUTES.companys,
        icon: <ApartmentOutlined />,
      },
      {
        label: 'Roles',
        key: ROUTES.roles,
        icon: <ControlOutlined />,
      },
    ],
  },
  {
    label: 'Инженер',
    key: ROUTES.pms,
    icon: <UserOutlined />,
    roleKey: 'engeener',
    children: [
      {
        label: 'Процессы',
        key: ROUTES.process,
        icon: <ControlOutlined />,
      },
      {
        label: 'Категории',
        key: ROUTES.category,
        icon: <BarsOutlined />,
      },
      {
        label: 'Модели',
        key: ROUTES.model,
        icon: <PartitionOutlined />,
      },
      {
        label: 'Список продуктов',
        key: ROUTES.product,
        icon: <TeamOutlined />,
      },
      {
        label: 'База',
        key: ROUTES.base,
        icon: <DatabaseOutlined />,
      },
    ],
  },
  {
    label: 'Менеджер продукта',
    key: ROUTES.productManager,
    icon: <UserOutlined />,
    roleKey: 'product-manager',
    children: [
      {
        label: 'Домой',
        key: ROUTES.productManagerMain,
        icon: <HomeOutlined />,
      },
      {
        label: 'Категории',
        key: ROUTES.productManagerCategory,
        icon: <BarsOutlined />,
      },
      {
        label: 'Модели',
        key: ROUTES.productManagerModel,
        icon: <PartitionOutlined />,
      },
      {
        label: 'Поставщик',
        key: ROUTES.productManagerProvider,
        icon: <UserOutlined />,
      },
      {
        label: 'Ткань',
        key: ROUTES.productManagerTissue,
        icon: <UserOutlined />,
      },
      {
        label: 'Углы',
        key: ROUTES.pmsManagerDirection,
        icon: <RadiusSettingOutlined />,
      },
      {
        label: 'Категория расходов',
        key: ROUTES.pmsManagerExpense,
        icon: <DollarOutlined />,
      },
    ],
  },
  {
    label: 'Поставщик',
    key: ROUTES.provider,
    icon: <CarOutlined />,
    roleKey: 'provider',
    children: [
      {
        label: 'Заказы',
        key: ROUTES.providerApplyProducts,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Продукты на складе',
        key: ROUTES.providerRelatedProducts,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Пользователи',
        key: ROUTES.providerMyUsers,
        icon: <UserOutlined />,
      },
    ],
  },
  {
    label: 'Поставщик ОТК',
    key: ROUTES.providerQa,
    icon: <CarOutlined />,
    roleKey: 'provider',
    children: [
      {
        label: 'Заказы',
        key: ROUTES.providerQaApplyProducts,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    label: 'Складовщик',
    key: ROUTES.storekeeperMain,
    icon: <UserOutlined />,
    roleKey: 'storekeeper',
    children: [
      {
        label: 'Домой',
        key: ROUTES.storekeeperMain,
        icon: <HomeOutlined />,
      },
      {
        label: 'Приход',
        key: ROUTES.storekeeperRequest,
        icon: <VerticalAlignBottomOutlined />,
      },
    ],
  },
  {
    label: 'Главный Складовщик',
    key: ROUTES.mainStorekeeperMyOrder,
    icon: <UserOutlined />,
    roleKey: 'main-storekeeper',
    children: [
      {
        label: 'Cклады',
        key: ROUTES.mainStorekeeperStock,
        icon: <HomeOutlined />,
      },
      {
        label: 'Список складов',
        key: ROUTES.mainStorekeeperWarehouseList,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Товары на складе',
        key: ROUTES.mainStorekeeperMyOrder,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Создать продукт',
        key: ROUTES.mainStorekeeperCreateProduct,
        icon: <PlusOutlined />,
      },
      {
        label: 'Заявки',
        key: ROUTES.mainStorekeeperApplications,
        icon: <FileTextOutlined />,
      },
      {
        label: 'Тип склада',
        key: ROUTES.mainStorekeeperWarehouseType,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    label: 'Оператор доставки',
    key: ROUTES.dms,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Заявки и Рейсы',
        key: ROUTES.dmsRequest,
        icon: <CarOutlined />,
      },
      {
        label: 'Курьер',
        key: ROUTES.dmsCourier,
        icon: <UserOutlined />,
      },
      {
        label: 'Локации',
        key: ROUTES.dmsLocation,
        icon: <EnvironmentOutlined />,
      },
      {
        label: 'Вознограждение',
        key: ROUTES.dmsReward,
        icon: <HistoryOutlined />,
      },
    ],
  },
  {
    label: 'Маркетолог',
    key: ROUTES.marketer,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Акции',
        key: ROUTES.marketerPromotion,
        icon: <GiftOutlined />,
      },
    ],
  },
  {
    label: 'Главный кассир',
    key: ROUTES.mainCashier,
    icon: <UserOutlined />,
    roleKey: 'main-cashier',
    children: [
      {
        label: 'Кассиры',
        key: ROUTES.mainCashierCashiers,
        icon: <UserOutlined />,
      },
      {
        label: 'Кассы',
        key: ROUTES.mainCashierCashbox,
        icon: <BankOutlined />,
      },
      {
        label: 'Вид оплаты',
        key: ROUTES.mainCashierPaymentType,
        icon: <DollarOutlined />,
      },
    ],
  },
  {
    label: 'Кассир',
    key: ROUTES.cashier,
    icon: <UserOutlined />,
    roleKey: 'cashier',
    children: [
      {
        label: 'Заявки',
        key: ROUTES.cashierRequests,
        icon: <VerticalAlignBottomOutlined />,
      },
    ],
  },
  {
    label: 'Директор по продажам',
    key: ROUTES.sellerDirector,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Выставочные залы',
        key: ROUTES.sellerDirectorShowrooms,
        icon: <ShopOutlined />,
      },
      {
        label: 'О клиентах',
        key: ROUTES.sellerDirectorClientInfo,
        icon: <UserOutlined />,
      },
      {
        label: 'Система мотивации',
        key: ROUTES.sellerDirectorMotivation,
        icon: <UserOutlined />,
      },
    ],
  },
  {
    label: 'Главный продавец',
    key: ROUTES.mainSeller,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Продавцы',
        key: ROUTES.mainSellerUsers,
        icon: <UserOutlined />,
      },
    ],
  },
  {
    label: 'Продавец',
    key: ROUTES.seller,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Домой',
        key: ROUTES.sellerProducts,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Корзинка',
        key: ROUTES.sellerBasketProducts,
        icon: <UnorderedListOutlined />,
      },
      {
        label: 'Учет посетителей',
        key: ROUTES.sellerAboutVisitedClients,
        icon: <UsergroupAddOutlined />,
      },
      {
        label: 'Мои заказы',
        key: ROUTES.sellerMyOrders,
        icon: <UnorderedListOutlined />,
      },
    ],
  },
  {
    label: 'Центр обработки',
    key: ROUTES.centarlOperator,
    icon: <UserOutlined />,
    roleKey: 'delivery-admin',
    children: [
      {
        label: 'Все заказы',
        key: ROUTES.centarlOperatorOrders,
        icon: <ShoppingCartOutlined />,
      },
      {
        label: 'Изменения',
        key: ROUTES.centarlOperatorChanges,
        icon: <RetweetOutlined />,
      },
    ],
  },
];
