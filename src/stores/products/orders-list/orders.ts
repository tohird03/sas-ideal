import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { IAddOrderProducts, IGetOrdersParams, IOrder } from '@/api/order/types';
import { ordersApi } from '@/api/order';
import dayjs from 'dayjs';

class OrdersStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditNewOrderModal = false;
  isOpenShowOrderModal = false;
  singleOrder: IOrder | null = null;
  addOrderProducts: IAddOrderProducts[] = [];
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

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

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  setIsOpenAddEditNewOrderModal = (isOpenAddEditNewOrderModal: boolean) => {
    this.isOpenAddEditNewOrderModal = isOpenAddEditNewOrderModal;
  };

  setIsOpenShowOrderModal = (isOpenShowOrderModal: boolean) => {
    this.isOpenShowOrderModal = isOpenShowOrderModal;
  };

  setSingleOrder = (singleOrder: IOrder | null) => {
    this.singleOrder = singleOrder;
  };

  setAddOrderProducts = (addOrderProducts: IAddOrderProducts[]) => {
    this.addOrderProducts = addOrderProducts;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const ordersStore = new OrdersStore();
