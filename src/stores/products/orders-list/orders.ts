import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { IGetOrdersParams, IOrder } from '@/api/order/types';
import { ordersApi } from '@/api/order';

class OrdersStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditNewOrderModal = false;
  singleOrder: IOrder | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getOrders = (params: IGetOrdersParams) =>
    ordersApi.getOrders(params)
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

  setIsOpenAddEditNewOrderModal = (isOpenAddEditNewOrderModal: boolean) => {
    this.isOpenAddEditNewOrderModal = isOpenAddEditNewOrderModal;
  };

  setSingleOrder = (singleOrder: IOrder | null) => {
    this.singleOrder = singleOrder;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const ordersStore = new OrdersStore();
