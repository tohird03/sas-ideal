import {makeAutoObservable} from 'mobx';
import {IPaymentType} from '@/api/paymentType/types';

class PaymentTypeStore {
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;
  singlePaymentType: IPaymentType | null = null;
  isOpenAddEditPaymentTypeModal = false;

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

  setSinglePaymentType = (singlePaymentType: IPaymentType | null) => {
    this.singlePaymentType = singlePaymentType;
  };

  setIsOpenAddEditPaymentTypeModal = (isOpen: boolean) => {
    this.isOpenAddEditPaymentTypeModal = isOpen;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const paymentTypeStore = new PaymentTypeStore();
