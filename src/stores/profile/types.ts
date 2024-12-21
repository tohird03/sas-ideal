import { ISeller } from '@/api/clients';

export interface IStaff extends ISeller {
  permissions: IPemissions[];
}

export interface IPemissions {
  id: string;
  key: IStaffPerKey;
  name: string;
}

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
};

export enum IStaffPerKey {
  GET_PRODUCTS = 'page_products',
  GET_ORDER = 'page_orders',
  GET_INCOME_ORDERS = 'page_incomeorders',
}
