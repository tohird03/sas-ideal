import {makeAutoObservable} from 'mobx';
import {IUser} from '@/api/users/types';

class MyUserStores {
  pageSize = 10;
  pageNumber = 1;
  search: string | null = null;
  isOpenAddEditUserModal = false;
  singleUser: IUser | null = null;
  isOpenHaveUserErrorModal = false;
  haveErrorSingleUser: IUser | null = null;
  isOpenRolesModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditUserModal = (isOpen: boolean) => {
    this.isOpenAddEditUserModal = isOpen;
  };

  setSingleUser = (singleUser: IUser | null) => {
    this.singleUser = singleUser;
  };

  setIsOpenHaveUserErrorModal = (isOpenHaveUserErrorModal: boolean) => {
    this.isOpenHaveUserErrorModal = isOpenHaveUserErrorModal;
  };

  setHaveErrorSingleUser = (haveErrorSingleUser: IUser | null) => {
    this.haveErrorSingleUser = haveErrorSingleUser;
  };

  setIsOpenRolesModal = (isOpen: boolean) => {
    this.isOpenRolesModal = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const myUsersStore = new MyUserStores();
