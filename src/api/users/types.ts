import {ICompany} from '../companys/types';
import {IShowroom} from '../showroom/types';
import {IPagination} from '../types';
import {IWarehouses} from '../wmsWarehouses/types';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  rating: number;
  userRoles: IRole[];
  allRoles: IRole[];
  avatar: string;
  companies: IUserCompanies[];
  company: ICompany;
  createdAt: string;
  warehouse?: IWarehouses;
  showroom?: IShowroom;
}
export interface IUserCompanies {
  id: string;
  name: string;
}
export interface IGetUsersByRoleParams extends IPagination {
  flag?: string;
  role?: string;
}
export interface IRole {
  id: string;
  name: string;
  permissions: IPermession[];
}
export interface IPermession {
  id: string;
  name: string;
  status: boolean;
}
export interface IUserParams {
  page: number;
  pageSize: number;
  search: string;
  searchBy: string;
  company?: string;
}
export interface IUserData {
  count: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  userList: IUser[];
}
export interface IUserProfile {
  phone: string;
  username: string;
}
export interface IAddUser {
  id?: string;
  phone: string;
  username?: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string[];
  showroomId?: string;
  priviliges: IAddUserPriviges[];
  connectCompany?: string[];
  disconnectCompany?: string[];
  avatar: string;
  rating?: number;
  warehouseId?: string;
  warehouse?: {
    name: string;
    location: string;
    warehouseTypeId: string;
  };
  col_id?: string;
}

export interface IAddUserPriviges {
  role: string;
  permissions: string[];
}

export interface Privigilas {
  connectPrivigilas: {
    role: string[];
    permessions: string[];
  };
  disconnectPrivigilas: {
    role: string[];
    permessions: string[];
  };
}

export interface IEditUser {
  id?: string;
  phone: string;
  username?: string;
  password: string;
  firstName: string;
  company: string[];
  priviliges: Privigilas;
  connectCompany?: string[];
  disconnectCompany?: string[];
  avatar: string;
}
export interface ISearchBy {
  phone: string;
  fullName: string;
}

export interface IResetPassword {
  id: string;
  password: string;
}
export interface IAllCompanies {
  id: string;
  name: string;
}

export interface IGetRolePermession {
  userId: string;
  roleId: string;
}
export interface IRoleUserByPermession {
  assigned: IPermession[];
  unassigned: IPermession[];
}

export interface IRemoveUserFromShowroom {
  showroomId: string;
  users: string;
}

export interface IRevokeUser {
  userId: string;
  role: string;
}

export interface IGetUserProviderParams extends IPagination {
  search?: string;
  companyId?: string;
}

export interface IUserProviderEdit {
  connectPriviliges: {
    role: string[];
    permissions: string[];
  };
  disconnectPriviliges: {
    role: string[];
    permissions: string[];
  };
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  avatar: string;
  userId: string;
}

export interface IGetProviderUsersParams extends IPagination {
  search?: string;
  companyId?: string;
}

export interface IGetMainSellerUsersParams extends IPagination {
  search?: string;
}


export interface IMainSellerUsers extends IUser {
  averageBill: number;
}

export interface IGetMainSellerUsersData {
  count: number;
  userList: IMainSellerUsers[];
}
