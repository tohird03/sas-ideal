import {makeAutoObservable} from 'mobx';
import {IUser} from '@/api/users/types';

class PmProviderStore {
  pageNumber = 1;
  pageSize = 10;
  company: string | null = null;
  search: string | null = null;
  isOpenAddEditProviderModal = false;
  singleProvider: IUser | null = null;
  whileAddUserIsHaveUserError = false;
  isHaveSingleUser: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setCompany = (company: string | null) => {
    this.company = company;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditProviderModal = (isOpen: boolean) => {
    this.isOpenAddEditProviderModal = isOpen;
  };

  setSingleProvider = (singleProvider: IUser | null) => {
    this.singleProvider = singleProvider;
  };

  setWhileAddUserIsHaveUserError = (whileAddUserIsHaveUserError: boolean) => {
    this.whileAddUserIsHaveUserError = whileAddUserIsHaveUserError;
  };

  setIsHaveSingleUser = (isHaveSingleUser: IUser | null) => {
    this.isHaveSingleUser = isHaveSingleUser;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
  }
}

export const pmProviderStore = new PmProviderStore();
