import {makeAutoObservable} from 'mobx';
import {IPayment} from '@/api/payment/types';

class CashierRequestStore {
  pageNumber = 1;
  pageSize = 10;
  singleRequest: IPayment | null = null;
  isOpenCreatePaymentModal = false;

  constructor() {
    makeAutoObservable(this);
  }


  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSingleRequest = (singleRequest: IPayment | null) => {
    this.singleRequest = singleRequest;
  };

  setIsOpenCreatePaymentModal = (isOpen: boolean) => {
    this.isOpenCreatePaymentModal = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const cashierRequestStore = new CashierRequestStore();
