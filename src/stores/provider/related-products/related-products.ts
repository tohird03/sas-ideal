import {makeAutoObservable} from 'mobx';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {IGetWmsProvidersStorekeeperProductsTypes} from '@/api/wmsProducts/types';

class RelatedProductsStore {
  pageSize = 10;
  pageNumber = 1;
  isOpenProductUploadModal = false;
  productActiveTab: IGetWmsProvidersStorekeeperProductsTypes = IGetWmsProvidersStorekeeperProductsTypes.Common;
  singleCommonProduct: IMainStorekeeperProductList | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setIsOpenProductUploadModal = (isOpen: boolean) => {
    this.isOpenProductUploadModal = isOpen;
  };

  setProductActiveTab = (activeTab: IGetWmsProvidersStorekeeperProductsTypes) => {
    this.productActiveTab = activeTab;
  };

  setSingleCommonProduct = (singleCommonProduct: IMainStorekeeperProductList | null) => {
    this.singleCommonProduct = singleCommonProduct;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const relatedProductsStore = new RelatedProductsStore();
