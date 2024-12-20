import {TStage} from './types';
export const stage = process.env.REACT_APP_STAGE || 'dev';

export enum Endpoints {
  Base = '',

  // SETTINGS
  SignIn = '/admin/sign-in',
  RefreshToken = '/dashboard-auth/refresh',
  UserProfile = '/admin/profile',

  // STAFFS
  Staffs = '/admin',

  // CLIENTS
  Users = '/user',
  Clients = '/user/client',
  Supplier = '/user/supplier',

  // PRODUCTS
  products = '/product',
  productsIncomeOrder = '/incomingOrder',
  productsOrder = '/Order',
  productsOrderProduct = '/orderProduct',
  productsOrderExel = '/Order/upload',

  // PAYMENT
  payment = '/payment',

  // ROLES
  role = '/role',
}

const config: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://santexnika.mirabdulloh.uz',
  },
  prod: {
    apiUrl: 'https://santexnika.mirabdulloh.uz',
  },
};

const imgConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
  prod: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
};


export const umsStages = config[stage];
export const imgStages = imgConfig[stage];
