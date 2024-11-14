import {ReactNode} from 'react';

export interface IMenuItems {
  children?: IMenuItems[] | [];
  icon: ReactNode;
  key: string;
  label: string;
  parent?: IMenuItems['key'];
  notification?: ReactNode;
  roleKey?: string;
}


export enum IAppRole {
  SuperAdmin = 'super-admin',
  Engeneer = 'engeener',
  ProductManager = 'product-manager',
  Provider = 'provider',
  Storekeeper = 'storekeeper',
  MainStorekeeper = 'main-storekeeper',
  Seller = 'seller',
  MainSeller = 'main-seller',
  HeadSeller = 'head-seller',
  DeliveryAdmin = 'delivery-admin',
  Courier = 'courier',
}
