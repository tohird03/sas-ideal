import { IPagination } from "../types";

export interface IGetProductsParams extends IPagination{
  search?: string;
}


export interface IProducts {
  id: string;
  name: string;
  count: number;
  unit: string;
  min_amount: number;
  // Sotib olingan narx
  cost: number;
  // Sotuvda sotiladigan narxi
  selling_price: number;
  // Kelishtirib berishning oxirgi narxi
  wholesale_price: number;
}
