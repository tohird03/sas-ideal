import { IClientsInfo, ISeller } from "../clients";
import { IProducts } from "../product/types";
import { IPagination, IPayment } from "../types";

export interface IOrder {
  id: string;
  client: IClientsInfo;
  seller: ISeller;
  payment: IPayment;
  products: IOrderProducts[];
  sum: number;
  accepted: boolean;
  createdAt: string;
}

export interface IGetOrdersParams extends IPagination {
  search?: string;
}


export interface IOrderProducts {
  id: string,
  cost: string;
  count: number,
  price: number;
  product: IProducts;
}
