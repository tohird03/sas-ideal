import {makeAutoObservable} from 'mobx';
import {IOrderDetailChange} from '@/api/orders/types';

class ChangesStore {
  pageNumber = 1;
  pageSize = 10;
  isOpenChangeProductInfoRequestModal = false;
  isOpenAddProductRequestModal = false;
  singleOrderDetailsChange: IOrderDetailChange | null = null;

  constructor() {
    makeAutoObservable(this);
  }


  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setIsOpenChangeProductInfoRequestModal = (isOpen: boolean) => {
    this.isOpenChangeProductInfoRequestModal = isOpen;
  };

  setIsOpenAddProductRequestModal = (isOpen: boolean) => {
    this.isOpenAddProductRequestModal = isOpen;
  };

  setSingleOrderDetailsChange = (singleOrderDetailsChange: IOrderDetailChange | null) => {
    this.singleOrderDetailsChange = singleOrderDetailsChange;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const changesStore = new ChangesStore();
