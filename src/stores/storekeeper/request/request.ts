import {makeAutoObservable} from 'mobx';
import {IRequestToWarehouse, IRequestToWarehouseProducts, IStorekeeperRequestFilter} from '@/api/storekeeper/types';

class StorekeeperRequestStore {
  pageSize = 10;
  pageNumber = 1;
  requestFilter: IStorekeeperRequestFilter | null = null;
  isOpenFilterModal = false;
  search: string | null = null;
  singleRequest: IRequestToWarehouse | null = null;

  singleRequestProductPageNumber = 1;
  singleRequestProductPageSize = 10;
  isOpenAddProductModal = false;
  singleRequestToWarehouseProducts: IRequestToWarehouseProducts | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };
  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setRequestFilter = (filter: IStorekeeperRequestFilter | null) => {
    this.requestFilter = filter;
  };

  setIsOpenFilterModal = (isOpen: boolean) => {
    this.isOpenFilterModal = isOpen;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setSingleRequest = (singleRequest: IRequestToWarehouse | null) => {
    this.singleRequest = singleRequest;
  };

  setSingleRequestProductPageNumber = (pageNumber: number) => {
    this.singleRequestProductPageNumber = pageNumber;
  };

  setSingleRequestProductPageSize = (pageSize: number) => {
    this.singleRequestProductPageSize = pageSize;
  };

  setIsOpenAddProductModal = (isOpen: boolean) => {
    this.isOpenAddProductModal = isOpen;
  };

  setSingleRequestToWarehouseProducts = (singleRequestToWarehouseProducts: IRequestToWarehouseProducts | null) => {
    this.singleRequestToWarehouseProducts = singleRequestToWarehouseProducts;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const storekeeperRequestStore = new StorekeeperRequestStore();
