
// storekeeper branch start---

import {ICategories} from '../categories/types';
import {IDirection} from '../direction/types';
import {IProductStatus} from '../mainStorekeeper/types';
import {IModel} from '../model/types';
import {IProviderList} from '../provider/types';
import {ITissueColor} from '../tissue/types';
import {IOneElement, IPagination} from '../types';
import {IUser} from '../users/types';
import {IWarehouses} from '../wmsWarehouses/types';

// storekeeper main types ---
export interface IStorekeeperMainType {
  id: string;
  partId: string;
  name: string;
  price: number;
  quantity: number;
  countDay: number;
  images: string;
  category: Category;
  model: IOneElement;
  provider: IOneElement;
  formula: string;
  maxPrice: number;
  minPrice: number;
  tissue: IOneTissueColor;
  direction: Category;
}

export interface StorekeeperAllProductList extends IOneResponse {
  productList: IStorekeeperMainType[];
}

export interface IOneParams {
  pageNumber: number;
  pageSize: number;
}

export interface IOneResponse {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetCategoryParams extends IOneParams {
  title?: string;
}

export interface IGetModelParams extends IOneParams {
  name?: string;
}

interface Category {
  id: string;
  title: string;
}

interface CategoryModels extends Category {
  models: IOneElement;
}

export interface IGetDirectionListResponse extends IOneResponse {
  directionList: Category[];
}

export interface IGetCategoryListResponse extends IOneResponse {
  categoryList: CategoryModels[];
}
export interface IGetModelListResponse extends IOneResponse {
  modelList: IOneElement[];
}

export interface IGetProductStatusListResponse extends IOneResponse {
  productStatusList: IOneElement[];
}
interface IOneModel {
  id: string;
  name: string;
  categoryId: string;
  qtyPerDay: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
interface IOneCategory {
  id: string;
  title: string;
}
interface IOneTissueColor {
  id: string;
  name: string;
  hexColor: string;
  tissue: {
    id: string;
    name: string;
  };
}
export interface StorekeeperProduct {
  id: string;
  name: string;
  countDay: number;
  partId: string;
  quantity: number;
  processCount: number;
  minQuantity: number;
  model: IOneModel;
  direction: any;
  provider: IOneElement;
  category: IOneCategory;
  tissue: IOneTissueColor;
  images: string[];
  productStatus: IOneElement;
  warehouse: IOneElement;
  wmsProductId: string;
}
export interface StorekeeperProductList extends IOneResponse {
  productList: StorekeeperProduct[];
}
export interface IStorekeeperFilterParams extends IStorekeeperFilter {
  pageSize: number;
  pageNumber: number;
}

export enum IStorekeeperProductType {
  Common = '',
  Details = 'details',
}

export interface IStorekeeperFilter {
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
  statusId?: string;
  filter?: IStorekeeperProductType;
}

export interface IEditProductStatusQty {
  quantity?: number;
  productStatusId?: string;
  partId?: string;
}

export interface IAddProductBasketType extends IEditProductStatusQty {
  pmsProductId?: string;
}

export interface IStorekeeperCartProduct {
  id: string;
  name: string;
  countDay: string;
  quantity: string;
  images: string;
  model: IOneElement;
  direction: IOneElement;
  category: IOneCategory;
  tissue: IOneTissueColor;
  productStatus: IOneElement;
  provider: IOneElement;
  cartId: string;
}

export interface IStorekeeperCartAllProducts extends IOneResponse {
  cartList: IStorekeeperCartProduct[];
}


// STOREKEEPER REQUEST TO WAREHOUSE
export interface IRequestToWarehouse {
  id: string;
  requestId: string;
  from: {
    id: string;
    name: string;
  };
  type: string;
  fromClient: string;
  toWarehouse: {
    id: string;
    name: string;
  };
  status: string;
  deliveryDate: string;
  createdAt: string;
  requester: IUser;
}

export interface IGetRequestToWarehouseData {
  requestsList: IRequestToWarehouse[];
  count: number;
}


export interface IStorekeeperRequestFilter extends IPagination {
  tissueColorId?: string;
  tissueId?: string;
  providerId?: string;
  directionId?: string;
  categoryId?: string;
  modelId?: string;
  modelName?: string;
  name?: string;
}


export interface IRequestToWarehouseProducts {
  id: string;
  name: string;
  partId: number;
  quantity: 5;
  count: 5;
  model: IModel;
  direction: IDirection;
  provider: IProviderList;
  category: ICategories;
  tissue: ITissueColor;
  images: string;
  productStatus: IProductStatus;
  warehouse: IWarehouses;
  requestsProductId: string;
}

export interface IGetRequestToWarehouseProducts extends IPagination {
  requestId: string;
}

export interface IGetRequestToWarehouseProductsData {
  count: number;
  requestsProductList: IRequestToWarehouseProducts[];
}

export interface IAddProductFromRequest {
  partId: number;
  productId: string;
  productStatusId: string;
  quantity: number;
}
