import {makeAutoObservable} from 'mobx';
import {IClientFrom} from '@/api/seller/sellerClientFrom/types';
import {IClientStatus} from '@/api/seller/sellerClientStatus/types';

class ClientInfoStore {
  clientFromName: string | null = null;
  singleClientFrom: IClientFrom | null = null;
  isOpenAddEditFromClientModal = false;

  clientStatusName: string | null = null;
  singleClientStatus: IClientStatus | null = null;
  isOpenAddEditClientStatusModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setClientFromName = (name: string | null) => {
    this.clientFromName = name;
  };

  setSingleClientFrom = (singleClientFrom: IClientFrom | null) => {
    this.singleClientFrom = singleClientFrom;
  };

  setIsOpenAddEditFromClientModal = (isOpen: boolean) => {
    this.isOpenAddEditFromClientModal = isOpen;
  };

  setClientStatusName = (statusName: string | null) => {
    this.clientStatusName = statusName;
  };

  setSingleClientStatus = (singleClientStatus: IClientStatus | null) => {
    this.singleClientStatus = singleClientStatus;
  };

  setIsOpenAddEditClientStatusModal = (isOpen: boolean) => {
    this.isOpenAddEditClientStatusModal = isOpen;
  };

  reset() {
    this.isOpenAddEditFromClientModal = false;
  }
}

export const clientInfoStore = new ClientInfoStore();
