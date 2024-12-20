import { IOrder } from '../order/types';
import {IPagination, IPayment} from '../types';

export interface IUpdateUser {
  id: string;
  name: string;
  phone: string;
}

// THIS SELLER USER
export interface ISeller {
  id: string;
  name: string;
  phone: string;
}

// CLIENT
export interface IClientsInfo {
  id: string;
  name: string;
  phone: string;
  debt: number;
  lastSale: string;
}

export interface IGetClientsInfoParams extends IPagination {
  search?: string;
}

export interface IAddClientInfo {
  id?: string;
  name: string;
  phone: string;
}

// SUPPLIER
export interface IGetSupplierInfoParams extends IPagination {
  search?: string;
}

export interface ISupplierInfo {
  id: string;
  name: string;
  phone: string;
  lastSale: string;
  debt: number;
}

export interface IAddSupplierInfo {
  id?: string;
  name: string;
  phone: string;
}

export interface IDeedPayment extends IPayment {
  type: 'payment';
}

export interface IDeedOrder extends IOrder {
  type: 'order';
}

export type IDeed = IDeedPayment | IDeedOrder;

export interface IGetClientDeedParams {
  id: string;
  startDate?: string;
  endDate?: string;
}
