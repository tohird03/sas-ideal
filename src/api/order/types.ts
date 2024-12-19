import { IClientsInfo, ISeller } from "../clients";
import { IProducts } from "../product/types";
import { IPagination, IPayment, IPaymentType } from "../types";

export interface IOrder {
  id: string;
  client: IClientsInfo;
  seller: ISeller;
  payment: IPayment;
  products: IOrderProducts[];
  sum: number;
  debt: number;
  accepted: boolean;
  createdAt: string;
  articl: number;
}

export interface IGetOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}


export interface IOrderProducts {
  id: string,
  cost: number;
  count: number,
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddOrderProducts {
  product_id: string;
  count: number;
  price: number;
}

export interface IAddOrderModalForm extends IAddOrderProducts {
  clientId: string;
  createdAt: string;
}

export interface IAddOrder {
  clientId: string;
  createdAt: string;
  accepted?: boolean;
  products: IAddOrderProducts[];
}

export interface IUpdateOrder {
  id: string;
  clientId: string;
  createdAt: string;
  accepted: boolean;
}

export interface IUploadOrderToExelParams extends IGetOrdersParams {
  orderId: string;
}

export interface IOrderProductAdd extends IAddOrderProducts {
  order_id: string;
}

export interface IUpdateOrderProduct {
  id: string;
  count: number;
  price: number;
}
