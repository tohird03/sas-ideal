import {IProductList} from '../product_list/types';

export interface IProductListData {
  count: number;
  productList: IProductList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IProductListParams {
  pageNumber: number;
  pageSize: number;
  name: string;
  categoryId?: string;
  modelId?: string;
}

export interface IPmProductAdd {
  id?: string;
  name: string;
  quantity: number;
  price: any;
  modelId: string;
  categoryId: string;
  images: [];
  providerId: string;
  countDay: number;
}

export interface IPmsBulkUpdate {
  products: string[];

  costPrice?: number;
  factoryPrice?: number;
  investorPrice?: number;
  b2b?: number;
  retailPrice?: number;

}

export interface IPriceFactor {
  sale: number;
}
