import { ISupplierInfo } from "../clients";
import { IProducts } from "../product/types"
import { IStaffs } from "../staffs";
import { IPagination, IPayment, IPaymentType } from "../types";

export interface IIncomeOrder {
  id: string,
  sum: number,
  debt: number,
  accepted: boolean,
  supplier: ISupplierInfo,
  admin: IStaffs,
  payment: IPayment;
  incomingProducts: IIncomeProduct[];
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
  productOldId: string;
  count: number;
  cost: number;
}

export interface IAddIncomeOrderForm extends IPaymentType {
  supplierId: string;
  createdAt: string;
}

export interface IAddEditIncomeOrder {
  supplierId: string;
  payment: IPaymentType;
  products: IAddIncomeOrderProducts[];
  createdAt: string;
  accepted: boolean;
}

export interface IUpdateIncomeOrder {
  id: string;
  supplierId: string;
  payment: IPaymentType;
  addProducts: IAddIncomeOrderProducts[];
  updateProducts?: IAddIncomeOrderProducts[];
  removeProducts: IUpdateOrderRemoveProducts[];
  createdAt: string;
}

export interface IUpdateOrderRemoveProducts {
  id: string;
  product_id: string;
  count: number;
  cost: number;
}
