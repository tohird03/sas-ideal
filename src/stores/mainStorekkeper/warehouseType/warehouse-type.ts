import {makeAutoObservable} from 'mobx';
import {IWarehouseType} from '@/api/warehouseType/types';

class WarehouseTypeStore {
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;
  isOpenAddEditWarehouseTypeModal = false;
  singleWarehouseType: IWarehouseType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setName = (name: string | null) => {
    this.name = name;
  };

  setIsOpenAddEditWarehouseTypeModal = (isOpen: boolean) => {
    this.isOpenAddEditWarehouseTypeModal = isOpen;
  };

  setSingleWarehouseType = (singleWarehouseType: IWarehouseType | null) => {
    this.singleWarehouseType = singleWarehouseType;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.name = null;
  }
}

export const warehouseTypeStore = new WarehouseTypeStore();
