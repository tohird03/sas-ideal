import {makeAutoObservable} from 'mobx';
import {IProductList, IProductListParams} from '@/api/product_list/types';

class MotivationStore {
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;
  productsFilter: IProductListParams | null = null;
  isOpenFilterModal = false;
  isOpenBulkUpdateModal = false;
  selectedProducts: IProductList[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setName = (name: string | null) => {
    this.name = name;
  };

  setIsOpenFilterModal = (isOpen: boolean) => {
    this.isOpenFilterModal = isOpen;
  };

  setIsOpenBulkUpdateModal = (isOpen: boolean) => {
    this.isOpenBulkUpdateModal = isOpen;
  };

  setProductsFilter = (productsFilter: IProductListParams | null) => {
    this.productsFilter = productsFilter;
  };

  setSelectedProducts = (selectedProducts: IProductList[]) => {
    this.selectedProducts = selectedProducts;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const motivationStore = new MotivationStore();
