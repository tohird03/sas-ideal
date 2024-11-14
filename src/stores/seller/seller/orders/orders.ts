import {makeAutoObservable} from 'mobx';
import {IGetSingleOrder} from '@/api/orders/types';
import {ISellerProductSalePayments} from '@/api/seller/sellerSaleAndOrder/types';

export enum EMyOrdersTabs {
  Client = 'client',
  Products = 'products',
  Payments = 'payments',
}

class SellerMyOrdersStore {
  pageNumber = 1;
  pageSize = 10;
  clientName: string | null = null;
  clientPhone: string | null = null;
  singleMyOrderActiveTab: EMyOrdersTabs = EMyOrdersTabs.Client;

  mySingleOrderPrePayments: ISellerProductSalePayments[] = [];
  isOpenMySingleOrderPrePaymentsModal = false;

  isOpenMySingleOrderPreProductsModal = false;
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

  setClientName = (clientName: string | null) => {
    this.clientName = clientName;
  };

  setClientPhone = (clientPhone: string | null) => {
    this.clientPhone = clientPhone;
  };

  setSingleMyOrderActiveTab = (singleMyOrderActiveTab: EMyOrdersTabs) => {
    this.singleMyOrderActiveTab = singleMyOrderActiveTab;
  };

  setMySingleOrderPrePayments = (mySingleOrderPrePayments: ISellerProductSalePayments[]) => {
    this.mySingleOrderPrePayments = mySingleOrderPrePayments;
  };

  setIsOpenMySingleOrderPrePaymentsModal = (isOpenMySingleOrderPrePaymentsModal: boolean) => {
    this.isOpenMySingleOrderPrePaymentsModal = isOpenMySingleOrderPrePaymentsModal;
  };

  setIsOpenMySingleOrderPreProductsModal = (isOpenMySingleOrderPreProductsModal: boolean) => {
    this.isOpenMySingleOrderPreProductsModal = isOpenMySingleOrderPreProductsModal;
  };

  setMySingleOrderDatas = (mySingleOrderDatas: IGetSingleOrder | null) => {
    this.mySingleOrderDatas = mySingleOrderDatas;
  };

  setMySingleOrderLoading = (mySingleOrderLoading: boolean) => {
    this.mySingleOrderLoading = mySingleOrderLoading;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.clientName = null;
    this.clientPhone = null;
  }
}

export const sellerMyOrdersStore = new SellerMyOrdersStore();
