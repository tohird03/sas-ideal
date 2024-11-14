import {IPagination} from '../types';
import {IUser} from '../users/types';

export interface IGetCashboxParams extends IPagination {
  name?: string;
}

export interface IGetCashboxData {
  cashboxList: ICashbox[];
  count: number;
}

export interface ICashbox {
  id: string;
  name: string;
  balance: number;
  cashier: IUser;
  sources: ICashboxSource[];
}

export interface ICashboxSource {
  id: string;
  name: string;
}

export interface IAddEditCashbox {
  id?: string;
  name: string;
  balance: number;
  cashierId: string;
  sources: string[];
}


export interface ITransferMoneyFromCashboxParams {
  description: string;
  fromCashboxId: string;
  sum: number;
  toCashboxId: string;
}
