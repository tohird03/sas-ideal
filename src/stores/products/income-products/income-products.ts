import {makeAutoObservable} from 'mobx';
import {clientsInfoApi} from '@/api/clients';
import {addNotification} from '@/utils';
import {IGetIncomeProductsParams, IIncomeProduct} from '@/api/income-products/types';
import { incomeProductsApi } from '@/api/income-products';

class IncomeProductsStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditIncomeProductsModal = false;
  singleIncomeProduct: IIncomeProduct | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getIncomeProducts = (params: IGetIncomeProductsParams) =>
    incomeProductsApi.getIncomeOrder(params)
      .then(res => res)
      .catch(addNotification);

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditIncomeProductsModal = (isOpenAddEditIncomeProductsModal: boolean) => {
    this.isOpenAddEditIncomeProductsModal = isOpenAddEditIncomeProductsModal;
  };

  setsingleIncomeProduct = (singleIncomeProduct: IIncomeProduct | null) => {
    this.singleIncomeProduct = singleIncomeProduct;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const incomeProductsStore = new IncomeProductsStore();
