import {IPagination} from '../types';

export interface IGetWarehouseData {
  count: number;
  warehouseList: IWarehouses[];
}

export interface IWarehouses {
  id: string;
  name: string;
  location: string;
  description: string;
  warehouseType: IWarehouseType;
  companyId: string;
  productCount: number;
  processCount: number;
  minCount: number;
  myWarehouse?: boolean;
}

export interface IWarehouseAddEdit {
  name: string;
  location: string;
  description: string;
  companyId: string;
  warehouseTypeId: string;
  warehouseId?: string;
}

export interface IGetWarehouseParams extends IPagination {
  name: string;
}

export interface IGetWarehouseTypeData {
  count: number;
  warehouseTypeList: IWarehouseType[];
}

export interface IWarehouseType {
  id: string;
  name: string;
  createdAt?: string;
}

export interface IGetWarehouseTypeParams extends IPagination {
  name: string;
}

export interface IGetWarehouseUserParams extends IPagination {
  warehouseId: string;
}

export interface IGetWarehouseUserData {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  userList: IWarehouseUser[];
}

export interface IWarehouseUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  rating: number;
  userRoles: IWarehouseUserRole[];
  allRoles: IWarehouseUserRole[];
  avatar: string;
  companies: IWarehouseUserCompanies[];
  createdAt: string;
}

export interface IWarehouseUserCompanies {
  id: string;
  name: string;
}
export interface IWarehouseUserRole {
  id: string;
  name: string;
  permissions: IWarehouseUserPermession[];
}
export interface IWarehouseUserPermession {
  id: string;
  name: string;
  status: boolean;
}
