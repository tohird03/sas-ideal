import {makeAutoObservable} from 'mobx';
import {
  IStorekeeperCartProduct,
  IStorekeeperFilter,
  IStorekeeperMainType,
  IStorekeeperProductType,
  StorekeeperProduct,
} from '@/api/storekeeper/types';

class StorekeeperStore {
  pageSize = 10;
  pageNumber = 1;

  isOpenStorekeeperMainProductAddEditModal = false;
  isEditStorekeeperMainProduct: IStorekeeperMainType | null = null;
  page = 1;
  limit = 10;
  startDate = '';
  endDat = '';
  search = '';
  filter: IStorekeeperProductType = IStorekeeperProductType.Common;
  oneProduct: StorekeeperProduct | null = null;

  isOpenStorekeeperCombineProductModal = false;

  isOpenStorekeeperMainFilterModal = false;
  isOpenStorekeeperShipProductModal = false;
  isOpenStorekeeperEditStatusMainModal = false;
  isOpenStorekeeperAddProductBasketModal = false;
  isOpenStorekeeperEditStatusBasketModal = false;

  storekeeperProductFIlterParams: IStorekeeperFilter | null = null;

  addProductBasket: IStorekeeperMainType | null = null;
  cartProduct: IStorekeeperCartProduct | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };
  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setFilter = (filter: IStorekeeperProductType) => {
    this.filter = filter;
  };

  setOneProduct = (product: StorekeeperProduct) => {
    this.oneProduct = product;
  };

  setAddProductBasket = (product: IStorekeeperMainType) => {
    this.addProductBasket = product;
  };

  setCartProduct = (product: IStorekeeperCartProduct) => {
    this.cartProduct = product;
  };

  // storekeeper main ---
  setIsOpenStorekeeperMainProductAddEditModal = (isOpen: boolean) => {
    this.isOpenStorekeeperMainProductAddEditModal = isOpen;
  };

  setIsEditStorekeeperMainProduct = (isEdit: IStorekeeperMainType | null) => {
    this.isEditStorekeeperMainProduct = isEdit;
  };

  setIsOpenStorekeeperMainFilterModal = (isOpen: boolean) => {
    this.isOpenStorekeeperMainFilterModal = isOpen;
  };

  setIsOpenStorekeeperShipProductModal = (isOpen: boolean) => {
    this.isOpenStorekeeperShipProductModal = isOpen;
  };

  setIsOpenStorekeeperEditStatusMainModal = (isOpen: boolean) => {
    this.isOpenStorekeeperEditStatusMainModal = isOpen;
  };

  setIsOpenStorekeeperAddProductBasketModal = (isOpen: boolean) => {
    this.isOpenStorekeeperAddProductBasketModal = isOpen;
  };

  setIsOpenStorekeeperEditStatusBasketModal = (isOpen: boolean) => {
    this.isOpenStorekeeperEditStatusBasketModal = isOpen;
  };

  setStorekeeperProductFIlterParams = (params: IStorekeeperFilter | null) => {
    this.storekeeperProductFIlterParams = params;
  };
}

export const storekeeperStore = new StorekeeperStore();
