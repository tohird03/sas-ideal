import { ISupplierInfo } from "../clients";
import { IProducts } from "../product/types"
import { IPagination } from "../types";

export interface IIncomeProduct {
  id: string,
  sum: 0,
  accepted: boolean,
  supplier: ISupplierInfo,
  incomingProducts: IProducts[];
  createdAt: string;
}

export interface IGetIncomeProductsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
