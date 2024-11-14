import {makeAutoObservable} from 'mobx';
import {ICashbox} from '@/api/cashbox/types';

class CashboxStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  singleCashbox: ICashbox | null = null;
  isOpenAddEditCashboxModal = false;
  isOpenTransferMoneyModal = false;
  isOpenSpendMoneyModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setSingleCashbox = (singleCashbox: ICashbox | null) => {
    this.singleCashbox = singleCashbox;
  };

  setIsOpenAddEditCashboxModal = (isOpen: boolean) => {
    this.isOpenAddEditCashboxModal = isOpen;
  };

  setIsOpenTransferModal = (isOpen: boolean) => {
    this.isOpenTransferMoneyModal = isOpen;
  };

  setIsOpenSpendMoneyModal = (isOpen: boolean) => {
    this.isOpenSpendMoneyModal = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const cashboxStore = new CashboxStore();
