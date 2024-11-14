import {makeAutoObservable} from 'mobx';
import {ICashier} from '@/api/cashier/types';

class CashierUserStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  singleCashier: ICashier | null = null;
  isHaveSingleUser: ICashier | null = null;
  isOpenAddEditCashierModal = false;
  isOpenWhileAddUserIsHaveUserErrorModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setSingleCashier = (singleCashier: ICashier | null) => {
    this.singleCashier = singleCashier;
  };

  setIsHaveSingleUser = (haveSingleUser: ICashier | null) => {
    this.isHaveSingleUser = haveSingleUser;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditCashierModal = (isOpen: boolean) => {
    this.isOpenAddEditCashierModal = isOpen;
  };

  setIsOpenWhileAddUserIsHaveUserErrorModal = (isOpen: boolean) => {
    this.isOpenWhileAddUserIsHaveUserErrorModal = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const cashierUserStore = new CashierUserStore();
