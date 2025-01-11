import { IClientsInfo, ISeller } from "../clients";
import { IProducts } from "../product/types";
import { IPagination } from "../types";

export interface IGetReturnedOrdersParams extends IPagination {
  search?: string;
  accepted?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IReturnedOrder {
  id: string,
  sum: number,
  cashPayment: number,
  fromClient: number,
  description: string,
  accepted: boolean,
  createdAt: string,
  client: IClientsInfo,
  seller: ISeller,
  products: IReturnedOrderProducts[]
}

export interface IReturnedOrderProducts {
  id: string,
  cost: number;
  count: number,
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddReturnedOrders {
  clientId: string,
  description?: string,
  products: IAddReturnedOrderProducts[];
}

export interface IAddReturnedOrderProducts {
  product_id: string,
  count: number,
  price: number
}
