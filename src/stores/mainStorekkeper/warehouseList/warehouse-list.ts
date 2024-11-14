import {makeAutoObservable} from 'mobx';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';

class WarehouseListStore {
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;

  productPageNumber = 1;
  productPageSize = 10;
  productName: string | null = null;
  isOpenProductChangeMinCountModal = false;
  singleProduct: IMainStorekeeperProductList | null = null;

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

  setProductPageNumber = (productPageNumber: number) => {
    this.productPageNumber = productPageNumber;
  };

  setProductPageSize = (productPageSize: number) => {
    this.productPageSize = productPageSize;
  };

  setProductName = (productName: string | null) => {
    this.productName = productName;
  };

  setIsOpenProductChangeMinCountModal = (isOpenProductChangeMinCountModal: boolean) => {
    this.isOpenProductChangeMinCountModal = isOpenProductChangeMinCountModal;
  };

  setSingleProduct = (singleProduct: IMainStorekeeperProductList | null) => {
    this.singleProduct = singleProduct;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.name = null;
    this.productName = null;
    this.productPageNumber = 1;
    this.productPageSize = 10;
  }
}

export const warehouseListStore = new WarehouseListStore();
