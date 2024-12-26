import {makeAutoObservable} from 'mobx';
import {addNotification} from '@/utils';
import { paymentApi } from '@/api/payment';
import { IIncomeGetClientsPaymentsParams, ISupplierPayments } from '@/api/payment-income/types';
import { incomePaymentApi } from '@/api/payment-income';

class SupplierPaymentsStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: ISupplierPayments | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getSupplierPayments = (params: IIncomeGetClientsPaymentsParams) =>
    incomePaymentApi.getIncomePayments(params)
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

  setSinglePayment = (singlePayment: ISupplierPayments | null) => {
    this.singlePayment = singlePayment;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const supplierPaymentsStore = new SupplierPaymentsStore();
