import {makeAutoObservable} from 'mobx';
import {IGetSingleOrder, IOrder} from '@/api/orders/types';
import {EMyOrdersTabs} from '@/stores/seller/seller/orders/orders';

class OrdersStore {
  pageNumber = 1;
  pageSize = 10;
  startDate: string | null = null;
  endDate: string | null = null;
  searchByProductId: string | null = null;
  singleOrder: IOrder | null = null;
  isOpenProductStatusChangeModal = false;
  isOpenProductChangeDeliveryDateModal = false;

  singleMyOrderActiveTab: EMyOrdersTabs = EMyOrdersTabs.Client;
  mySingleOrderDatas: IGetSingleOrder | null = null;
  mySingleOrderLoading = false;

  constructor() {
    makeAutoObservable(this);
  }


  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setStartDate = (startDate: string | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: string | null) => {
    this.endDate = endDate;
  };

  setSearchByProductId = (searchByProductId: string | null) => {
    this.searchByProductId = searchByProductId;
  };

  setSingleOrder = (singleOrder: IOrder | null) => {
    this.singleOrder = singleOrder;
  };

  setIsOpenProductStatusChangeModal = (isOpen: boolean) => {
    this.isOpenProductStatusChangeModal = isOpen;
  };

  setIsOpenProductChangeDeliveryDateModal = (isOpenProductChangeDeliveryDateModal: boolean) => {
    this.isOpenProductChangeDeliveryDateModal = isOpenProductChangeDeliveryDateModal;
  };

  setSingleMyOrderActiveTab = (singleMyOrderActiveTab: EMyOrdersTabs) => {
    this.singleMyOrderActiveTab = singleMyOrderActiveTab;
  };

  setMySingleOrderDatas = (mySingleOrderDatas: IGetSingleOrder | null) => {
    this.mySingleOrderDatas = mySingleOrderDatas;
  };

  setMySingleOrderLoading = (mySingleOrderLoading: boolean) => {
    this.mySingleOrderLoading = mySingleOrderLoading;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const ordersStore = new OrdersStore();
