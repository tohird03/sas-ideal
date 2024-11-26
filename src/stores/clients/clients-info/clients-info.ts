import {makeAutoObservable} from 'mobx';
import {clientsInfoApi, IClientsInfo, IGetClientsInfoParams} from '@/api/clients';
import {addNotification} from '@/utils';

class ClientsInfoStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditClientModal = false;
  singleClientInfo: IClientsInfo | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getClients = (params: IGetClientsInfoParams) =>
    clientsInfoApi.getClientsInfo(params)
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

  setIsOpenAddEditClientModal = (isOpenAddEditClientModal: boolean) => {
    this.isOpenAddEditClientModal = isOpenAddEditClientModal;
  };

  setSingleClientInfo = (singleClientInfo: IClientsInfo | null) => {
    this.singleClientInfo = singleClientInfo;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const clientsInfoStore = new ClientsInfoStore();
