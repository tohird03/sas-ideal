import {ICategories} from '@/api/categories/types';
import {IDirection} from '@/api/direction/types';
import {IModel} from '@/api/model/types';
import {ITissueColor} from '@/api/tissue/types';
import {IPagination, IProductStatus} from '@/api/types';
import {IProviderList} from '../provider/types';

export interface IGetWarehouseOrdersData {
  orderList: IWarehouseOrders[];
  count: number;
}

export interface IWarehouseOrders {
  id: string;
  orderId: number;
  quantity: number;
  model: IModel;
  category: ICategories;
  direction: IDirection;
  tissue: ITissueColor;
  provider: IProviderList;
  status: IProductStatus;
  date: string;
  pmsProductId: string;
}

export interface IWarehouseOrdersParams extends IPagination {
  filter?: IWarehouseOrdersFilterRole;
  flag?: IProductStatus;
}

export enum IWarehouseOrdersFilterRole {
  Provider = 'provider',
  Qa = 'provider-qa',
  Storekeeper = 'storekeeper',
}


export interface IProviderProductStatusChange {
  status: IProductStatus;
  productId: string;
}
