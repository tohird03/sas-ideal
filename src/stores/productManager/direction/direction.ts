import {makeAutoObservable} from 'mobx';
import {IDirection} from '@/api/direction/types';

class PmDirectionStore {
  isOpenAddEditDirectionModal = false;
  pageNumber = 1;
  pageSize = 10;
  singleDirection: IDirection | null = null;
  searchTitle: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsOpenAddEditDirectionModal = (isOpen: boolean) => {
    this.isOpenAddEditDirectionModal = isOpen;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSingleDirection = (singleDirection: IDirection | null) => {
    this.singleDirection = singleDirection;
  };

  setSearchTitle = (searchTitle: string | null) => {
    this.searchTitle = searchTitle;
  };

  reset() {
    this.isOpenAddEditDirectionModal = false;
  }
}

export const pmDirectionStore = new PmDirectionStore();
