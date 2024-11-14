import {ICashbox} from '../cashbox/types';
import {IPagination} from '../types';
import {IAddUser, IUser} from '../users/types';

export interface IGetCashierParams extends IPagination {
  search?: string;
}

export interface IGetCasheirData {
  userList: ICashier[];
  count: number;
}

export interface ICashier extends IUser {
  cashboxs: ICashbox[];
}

export interface IAddEditCashier extends IAddUser {
  cashboxIds: any;
}

export interface ICashierAction {
  paymentId: string;
  paymentTypeId: string;
  course100: number;
  description: string;
  residue: number;
  total: number;
  usd: number;
  uzs: number;
  uzsWithCourse: number;
}
