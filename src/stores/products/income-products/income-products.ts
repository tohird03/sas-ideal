import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import {IAddIncomeOrderProducts, IGetIncomeOrdersParams, IIncomeOrder} from '@/api/income-products/types';
import { incomeProductsApi } from '@/api/income-products';

class IncomeProductsStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditIncomeProductsModal = false;
  isOpenShowIncomeOrderModal = false;
  singleIncomeOrder: IIncomeOrder | null = null;
  addIncomeProducts: IAddIncomeOrderProducts[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getIncomeOrders = (params: IGetIncomeOrdersParams) =>
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

  setIsOpenShowIncomeOrderModal = (isOpenShowIncomeOrderModal: boolean) => {
    this.isOpenShowIncomeOrderModal = isOpenShowIncomeOrderModal;
  };

  setsingleIncomeOrder = (singleIncomeOrder: IIncomeOrder | null) => {
    this.singleIncomeOrder = singleIncomeOrder;
  };

  setAddIncomeProducts = (addIncomeProducts: IAddIncomeOrderProducts[]) => {
    this.addIncomeProducts = addIncomeProducts;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const incomeProductsStore = new IncomeProductsStore();
