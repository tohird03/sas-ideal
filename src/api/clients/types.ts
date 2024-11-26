import { IPagination } from '../types';

export interface IClientsInfo {
  id: string;
  name: string;
  phone: string;
}

export interface IGetClientsInfoParams extends IPagination {
  search?: string;
}

export interface IAddEditClientInfo {
  id?: string;
  name: string;
  phone: string;
}
