import { IPagination } from '../types';

export interface IStaffs {
  id: string;
  name: string;
  phone: string;
}

export interface IGetStaffsParams extends IPagination {
  search?: string;
}

export interface IAddOrEditStaff {
  id?: string;
  name: string;
  phone: string;
  password: string;
}
