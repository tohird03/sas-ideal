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
  product_name: string;
  product_id: string;
  count: number;
  price: number;
  cost: number;
  avarage_cost: number;
}

export interface IAddOrderModalForm extends IPaymentType {
  clientId: string;
  createdAt: string;
}

export interface IAddOrder {
  clientId: string;
  payment: IPaymentType;
  products: IAddOrderProducts[];
  createdAt: string;
  accepted: boolean;
}


export interface IUpdateOrder {
  id: string;
  clientId: string;
  payment: IPaymentType;
  addProducts: IAddOrderProducts[];
  updateProducts?: IAddOrderProducts[];
  removeProducts: IAddOrderProducts[];
  createdAt: string;
  accepted: boolean;
}
