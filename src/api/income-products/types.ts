import { ISupplierInfo } from "../clients";
import { IProducts } from "../product/types"
import { IPagination, IPaymentType } from "../types";

export interface IIncomeOrder {
  id: string,
  sum: 0,
  accepted: boolean,
  supplier: ISupplierInfo,
  incomingProducts: IIncomeProduct;
  createdAt: string;
}

export interface IIncomeProduct {
  id: string,
  cost: number,
  count: number,
  selling_price: number,
  wholesale_price: number,
  product: IProducts;
}

export interface IGetIncomeOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}


export interface IAddIncomeOrderProducts {
  product_name: string;
  product_id: string;
  count: number;
  cost: number;
}

export interface IAddIncomeOrderForm extends IPaymentType {
  supplierId: string;
}

export interface IAddEditIncomeOrder {
  supplierId: string;
  sum: number;
  payment: IPaymentType;
  products: IAddIncomeOrderProducts[];
}
