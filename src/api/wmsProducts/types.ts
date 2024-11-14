import {IProductList} from '../product_list/types';
import {IPagination} from '../types';

export interface IGetWmsProvidersStorekeeperProductsParams extends IPagination {
  filter: IGetWmsProvidersStorekeeperProductsTypes;
}

export enum IGetWmsProvidersStorekeeperProductsTypes {
  Details = 'details',
  Common = '',
}

export interface IProvidersStorekeeperProducts {
  count: number;
  productList: IProductList[];
}

export interface IProviderUploadProduct {
  partId: string;
  productId: string;
  quantity: number;
}


export interface IGetGeneratePartId {
  id: string;
}
