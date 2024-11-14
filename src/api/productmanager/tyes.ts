import {ReactNode} from 'react';
import {IOneElement} from '../types';

export enum IProductManagerTabStatus {
  Product = 'Продукты',
  Sets = '',
}

export interface IGetProductManagerMainProduct {
  id?: string;
  name: string;
  category: string;
  provider: string;
  note: string;
  purchasePrice: string;
  rosePrice: string;
}

export interface IGetProductManagerMainSets {
  id?: string;
  name: string;
  category: string;
  provider: string;
  note: string;
  purchasePrice: string;
  rosePrice: string;
}

export interface IGetCategoryManagerPricing {
  id?: string;
  name: string;
  formula: string;
  type: string | ReactNode;
  necessarily: string | ReactNode;
}

export interface IGetProductManagerTasksType {
  id?: string;
  factors: string;
  formula: string;
  percentage: string | ReactNode;
  result: number;
}

export interface IGetProductManagerSetsType {
  id?: string;
  category: string;
  model: string;
  corner: string;
  fabric_color: string;
  qty: string;
  result: number;
}

// ----- manager tissue ----

export interface IGetManagerTissue {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  tissueList: IGetManagerTissueList[];
}

export interface IGetManagerTissueList {
  id?: string;
  name?: string;
  createdAt?: string;
  tissueColors?: IGetManagerTissueListColors[];
  hexColor?: string | null;
  tissueId?: string;
  tissuesToDisconnect?: string[];
  tissueColorsToConnect?: string[];
  tissueColorsToDisconnect?: string[];
}

export interface IGetManagerTissueListColors {
  id?: string;
  name: string;
  hexColor: string;
}

export interface IGetManagerTissueParams {
  name: string;
  pageSize: number;
  pageNumber: number;
}

export interface IPostManagerTissue {
  id?: string;
  name: string;
}

export interface IPatchManagerTissue {
  id?: string;
  name?: string;
  tissueColorsToConnect?: string[];
  tissueColorsToDisconnect?: string[];
}

// manager product --

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
  countDay: number;
  modelId: string;
  categoryId: string;
  tissueColorId: string;
  images: string;
  providerId: string;
  productsToCreate: any[];
  basesToCreate: any[];
  directionId: string;
  formula: string;
  maxPrice: number;
  minPrice: number;
  priceFactors: any[];
  oldPriceFactor: IPriceFactor;
}

export interface IPriceFactor {
  allowableSale: number;
  factoryPrice: number;
  b2b: number;
  costPrice: number;
  fixForSeller: number;
  investorPrice: number;
  retailPrice: number;
  sale: number;
  savedPercent: number;
}

export interface IGetCategoryParams {
  title: string;
  pageSize: number;
  pageNumber: number;
}

interface Model {
  id: string;
  name: string;
  qtyPerDay: number;
  category: IOneElement;
}

export interface IGetModelListResponse {
  count: number;
  modelList: Model[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}
interface Direction {
  id: string;
  title?: string;
}

export interface IGetDirectionListResponse {
  count: number;
  directionList: Direction[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetProductStatusListResponse {
  count: number;
  productStatusList: IOneElement[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetProviderListResponse {
  count: number;
  providerList: IOneElement[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IPmsOneParams {
  pageNumber: number;
  pageSize: number;
}

export interface IStorekeeperFilterParams extends IPmsProductFilter {
  pageSize: number;
  pageNumber: number;
}

export interface IPmsProductFilter {
  productStatusId?: string;
  warehouseId?: string;
  tissueColorId?: string;
  tissueId?: string;
  providerId?: string;
  directionId?: string;
  categoryId?: string;
  modelId?: string;
  modelName?: string;
  name?: string;
}

export interface IPmsAddProduct {
  id?: string;
  name: string;
  directionId?: string;
  providerId: string;
  categoryId: string;
  modelId: string;
  countDay: number;
  price?: number;
  quantity: number;
  tissueColorId: string;
  images: any[];
  oldPriceFactor: PmsOldPriceFactor;
  spends?: IProductAddMinPriceSpends[];
}

export interface PmsOldPriceFactor {
  costPrice?: number;
  factoryPrice?: number;
  investorPrice?: number;
  b2b?: number;
  retailPrice?: number;
  marginPrice?: number;
}

export interface IProductAddMinPriceSpends {
  spendTypeId: string;
  description: string;
  spend: number;
}

export interface IProductMinPrice extends IProductAddMinPriceSpends {
  id: number;
  spendTypeName: string;
}
