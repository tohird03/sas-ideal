import { makeAutoObservable } from 'mobx';
import { clientsInfoApi, IClientsInfo, IGetClientDeedParams, IGetClientsInfoParams } from '@/api/clients';
import { addNotification } from '@/utils';
import { ISingleSupplierTabs } from './types';
import { IClientsPayments, IGetClientsPaymentsParams } from '@/api/payment/types';
import { paymentApi } from '@/api/payment';

class SingleSupplierStore {
  activeClient: IClientsInfo | null = null;
  activeTabs: ISingleSupplierTabs = ISingleSupplierTabs.ORDER;

  // PAYMENTS
  paymentPage = 1;
  paymentPageSize = 10;
  paymentSearch: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: IClientsPayments | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getSingleClient = (clientId: string) =>
    clientsInfoApi.getSingleClient(clientId)
      .then(res => {
        if (res) {
          this.setActiveClient(res);

          return res;
        }
      })
      .catch(addNotification);

  setActiveClient = (activeClient: IClientsInfo | null) => {
    this.activeClient = activeClient;
  };

  setActiveTabs = (activeTabs: ISingleSupplierTabs) => {
    this.activeTabs = activeTabs;
  };

  // PAYMENTS
  getSingleClientsPayments = (params: IGetClientsPaymentsParams) =>
    paymentApi.getPayments(params)
      .then(res => res)
      .catch(addNotification);

  setPaymentPage = (paymentPage: number) => {
    this.paymentPage = paymentPage;
  };

  setPaymentPageSize = (paymentPageSize: number) => {
    this.paymentPageSize = paymentPageSize;
  };

  setPaymentSearch = (paymentSearch: string | null) => {
    this.paymentSearch = paymentSearch;
  };

  setIsOpenAddEditPaymentModal = (isOpenAddEditPaymentModal: boolean) => {
    this.isOpenAddEditPaymentModal = isOpenAddEditPaymentModal;
  };

  setSinglePayment = (singlePayment: IClientsPayments | null) => {
    this.singlePayment = singlePayment;
  };

  // DEED
  getClientDeed = (params: IGetClientDeedParams) =>
    clientsInfoApi.getClientDeed(params)
      .then(res => res)
      .catch(addNotification);

  reset() {
    this.activeClient = null;
    this.activeTabs = ISingleSupplierTabs.ORDER;
  }
}

export const singleSupplierStore = new SingleSupplierStore();
