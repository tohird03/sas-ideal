import {makeAutoObservable} from 'mobx';
import {clientsInfoApi, IGetSupplierInfoParams, ISupplierInfo} from '@/api/clients';
import {addNotification} from '@/utils';

class SupplierInfoStore {
  pageNumber = 1;
  pageSize = 10;
  search: string | null = null;
  isOpenAddEditSupplierModal = false;
  singleSupplierInfo: ISupplierInfo | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getSuppliers = (params: IGetSupplierInfoParams) =>
    clientsInfoApi.getSupplierInfo(params)
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

  setIsOpenAddEditSupplierModal = (isOpenAddEditSupplierModal: boolean) => {
    this.isOpenAddEditSupplierModal = isOpenAddEditSupplierModal;
  };

  setSingleSupplierInfo = (singleSupplierInfo: ISupplierInfo | null) => {
    this.singleSupplierInfo = singleSupplierInfo;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
  }
}

export const supplierInfoStore = new SupplierInfoStore();
