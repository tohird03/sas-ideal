import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { IClientsPayments, IGetClientsPaymentsParams } from '@/api/payment/types';
import { paymentApi } from '@/api/payment';

class PaymentsStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: IClientsPayments | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getClientsPayments = (params: IGetClientsPaymentsParams) =>
    paymentApi.getPayments(params)
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

  setIsOpenAddEditPaymentModal = (isOpenAddEditPaymentModal: boolean) => {
    this.isOpenAddEditPaymentModal = isOpenAddEditPaymentModal;
  };

  setSinglePayment = (singlePayment: IClientsPayments | null) => {
    this.singlePayment = singlePayment;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const paymentsStore = new PaymentsStore();
