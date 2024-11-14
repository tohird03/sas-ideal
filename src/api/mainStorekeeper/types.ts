import {ICategories} from '../categories/types';
import {IDirection} from '../direction/types';
import {IModel} from '../model/types';
import {IPagination} from '../types';
import {IWarehouses} from '../wmsWarehouses/types';

export interface IMainStorekeeperProductListData {
  count: number;
  productList: IMainStorekeeperProductList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IMainStorekeeperGetCartProductData {
  count: number;
  cartList: IMainStorekeeperProductList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IMainStorekeeperProductList {
  id: string;
  name: string;
  partId: string;
  quantity: number;
  count?: number;
  countDay?: number;
  minQuantity: number;
  processCount: number;
  direction?: IDirection;
  tissue: {
    id: string;
    name: string;
    hexColor: string;
    tissue: {
      id: string;
      name: string;
    };
  };
  category: ICategories;
  images: string[];
  model: IModel;
  provider: {
    id: string;
    name: string;
  };
  warehouse: IWarehouses;
  productStatus: {
    id: string;
    name: IWarehouseProductStatus;
  };
  cartId?: string;
  wmsProductId: string;
}

export interface IGetMainStProductParams extends IPagination {
  warehouseId?: string;
  tissueColorId?: string;
  tissueId?: string;
  categoryId?: string;
  modelId?: string;
  name?: string;
  modelName?: string;
  directionId?: string;
  provideId?: string;
  filter?: string;
}

export interface IUpdateStorekeeperWarehouse {
  id: string;
  name: string;
  location: string;
  description: string;
  warehouseType: string;
  companyId: string;
  warehouseId?: string;
}

export interface IAddProductToCard {
  quantity: number;
  partId: string;
  pmsProductId: string;
  productStatusId: string;
}

export interface IChangeProductMinCount {
  productId: string;
  warehouseId: string;
  quantity: string;
}

export interface IAddProductToWarhouse {
  warehouseId: string;
}

export interface IGetProductStatusParams extends IPagination {
  name: string;
}

export interface IGetProductStatusData {
  count: number;
  productStatusList: IProductStatus[];
}

export interface IProductStatus {
  id: string;
  name: string;
}

export enum IWarehouseProductStatus {
  ACTIVE = 'active',
  DEFECTED = 'defected',
  UPLOADED = 'uploaded',
  BOOKED = 'booked',
}

export const warehouseProductStatusColor: Record<IWarehouseProductStatus, string> = {
  [IWarehouseProductStatus.ACTIVE]: '#008000', // Green for active
  [IWarehouseProductStatus.DEFECTED]: '#ff0000', // Red for defected
  [IWarehouseProductStatus.UPLOADED]: '#0000ff', // Blue for uploaded
  [IWarehouseProductStatus.BOOKED]: '#ffa500', // Orange for booked
};

export interface RandomPartId {
  id: string;
}

export interface ICheckPartId {
  is_have: boolean;
}

export interface IRequestsParams extends ApplicationsFilterParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface IRequestList {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  requestsList: IRequest[];
}

export interface IRequest {
  id: string;
  requestId: number;
  clientName: string;
  clientPhone: string;
  from: {
    id: string;
    name: string;
  };
  to: string;
  status: string;
  deliveryDate: string;
  createdAt: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  };
}

export interface ApplicationsFilterParams {
  profile?: string;
  flag?: string;
  client?: string;
  deliveryDate?: Date | null;
  createdAt?: Date | null;
  status?: string;
  warehouseId?: string;
}

export interface IAddApplication {
  clientName: string;
  clientPhone: string;
  warehouseId: string;
  to: string;
  deliveryDate: string;
  note?: string;
}

export interface IAddResponseApplication {
  id: string;
  requestId: number;
  clientName: string;
  clientPhone: string;
  to: string;
  status: string;
  deliveryDate: string;
  createdAt: string;
  from: {
    id: string;
    name: string;
  };
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  };
}


export interface IApplicationProductResponse {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  requestsProductList: IMainStorekeeperProductList[];
}

export interface IApplicationProductParams {
  pageNumber: number;
  pageSize: number;
  requestId?: string;
}


interface ReqProductData {
  productId: string;
  quantity: number;
  statusId: string;
}

export interface IPostRequstProduct {
  requestId: string;
  products: ReqProductData[];
}

export interface IEditReqProductParams {
  id: string;
  quantity: number;
}

export interface OrderWarehouseProductParams {
  productId: string;
  providerId: string;
  warehouseId: string;
  quantity: number;
  date: Date;
}
