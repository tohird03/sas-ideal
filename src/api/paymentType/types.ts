import {IPagination} from '../types';

export interface IGetPaymentTypeData {
  count: number;
  paymentTypeList: IPaymentType[];
}

export interface IGetPaymentTypeParams extends IPagination {
  name?: string;
}

export interface IPaymentType {
  id: string;
  name: string;
  type: IPaymentTypeKindOf;
}

export interface IAddEditPaymentType {
  id?: string;
  name: string;
  type: IPaymentTypeKindOf;
}

export enum IPaymentTypeKindOf {
  Cash = 'cash',
  Card = 'card',
}

