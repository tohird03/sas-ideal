import {IProductList} from '../product_list/types';
import {IPagination} from '../types';

export interface IPromotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: IPromotionStatus;
  note: string;
  productsCount: number;
}

export interface IGetPromotionData {
  promotionList: IPromotion[];
  count: number;
}

export interface IGetPromotionParams extends IPagination {
  toDate?: Date;
  fromDate?: Date;
  name?: string;
}

export interface IAddEditPromotion {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  note: string;
}

export enum IPromotionStatus {
  Pending = 'pending',
  Inactive = 'inactive',
  Active = 'active',
}

export interface IPromotionProductListParams extends IPagination {
  name?: string;
  categoryId?: string;
  modelId?: string;
  modelName?: string;
  tissueId?: string;
  tissueColorId?: string;
  providerId?: string;
  directionId?: string;
  promotionId?: string;
}

export interface IPromotionProducts {
  id: string;
  discount: number;
  product: IProductList;
}

export interface IGetPromotionProductData {
  promotionList: IPromotionProducts[];
  count: number;
}

export interface IAddEditPromotionProduct {
  discount: number;
  products: any[];
  promotionId: string;
}
