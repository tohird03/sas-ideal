import {IProductList} from '../product_list/types';
import {ISellerSalePayment} from '../seller/sellerSaleAndOrder/types';
import {IClient} from '../seller/sellerVisitedClients/types';
import {IPagination, IProductStatus} from '../types';
import {IUser} from '../users/types';

export interface IOrderParams extends IPagination {
  clientPhone?: string;
  clientName?: string;
  startDate?: string;
  endDate?: string;
  productId?: string;
}

export interface IOrder {
  id: string;
  orderId: number;
  client: IClient;
  createdAt: string;
  debt: number;
  deliveryDate: string;
  status: IProductStatus;
  totalSum: number;
  userId: string;
  orderDetailsCount: number;
  seller: IUser;
  quantity: number;
}

export interface IGetOrderData {
  orderList: IOrder[];
  count: number;
}

export interface IGetMyOrderDetailsParams extends IPagination {
  orderId: string;
}

export interface ISaleOrderProduct {
  id: string;
  status: ISaleOrderProductStatus;
  quantity: number;
  price: number;
  sale: number;
  product: IProductList;
  finalPrice: number;
  fixForSeller: number;
  fromWarehouse: boolean;
}

export enum ISaleOrderProductStatus {
  Canceled = 'cancelled',
  Success = 'success',
  Pending = 'pending',
}

export interface IGetSingleOrder extends IOrder {
  client: IClient;
  orderPaymentInfos: ISellerSalePayment[];
  orderDetails: ISaleOrderProduct[];
  orderDetailsCount: number;
}

export interface IOrderUpdateParams {
  orderId: string;
  deliveryDate?: Date;
  status?: IProductStatus;
}

export interface IOrderDetailChangeParams {
  orderDetailId: string;
  quantity?: number;
  finalPrice?: number;
  fixForSeller?: number;
  type: EOrderDetailChangeType;
}

export enum EOrderDetailChangeType {
  Change = 'change',
  Cancel = 'cancel',
}

export interface ISellerPrePaymentToOrder {
  orderId: string;
  payments: ISellerSalePayment[];
}

export interface IGetOrderDetailChange {
  orderDetailChangeList: IOrderDetailChange[];
  count: number;
}

export interface IOrderDetailChange extends IProductList {
  partId: string;
  type: EOrderDetailChangeType;
  createdAt: string;
}

export enum IUpdateOrderDetailChangeStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface IUpdateOrderDetailChange {
  type: EOrderDetailChangeType;
  status: IUpdateOrderDetailChangeStatus;
  orderDetailId: string;
}

export interface ISingleOrderDetailChangeUpdate {
  quantity: number;
  finalPrice: number;
  fixForSeller: number;
  status: {};
}

export interface ISingleOrderDetailChange extends IProductList {
  partId: number;
  newWalue: ISingleOrderDetailChangeUpdate;
  oldValue: ISingleOrderDetailChangeUpdate;
}
