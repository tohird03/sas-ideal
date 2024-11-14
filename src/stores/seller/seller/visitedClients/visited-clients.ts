import {makeAutoObservable} from 'mobx';

class VisitedClientsStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  isOpenAddNewVisitedClient = false;

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

  setFromDate = (fromDate: Date | null) => {
    this.fromDate = fromDate;
  };

  setToDate = (toDate: Date | null) => {
    this.toDate = toDate;
  };

  setIsOpenAddNewVisitedClient = (isOpen: boolean) => {
    this.isOpenAddNewVisitedClient = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const visitedClientsStore = new VisitedClientsStore();
