import {IPagination} from '../types';

export interface IGetExpenseTypeParams extends IPagination {
  name?: string;
}

export interface IGetExpenseTypeData {
  spendTypeList: IExpenseType[];
  count: number;
}

export interface IExpenseType {
  id: string;
  name: string;
  createdAt: string;
}

export interface IAddEditExpenseTypeParams {
  name: string;
  id: string;
}
