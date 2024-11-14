import {makeAutoObservable} from 'mobx';
import {IProductStatus} from '@/api/types';
import {IWarehouseOrders, IWarehouseOrdersFilterRole} from '@/api/wmsOrders/types';

class ApplyProductsQaStore {
  pageSize = 10;
  pageNumber = 1;
  isOpenProductStatusChangeModal = false;
  singleProduct: IWarehouseOrders | null = null;
  filter: IWarehouseOrdersFilterRole = IWarehouseOrdersFilterRole.Qa;
  productStatusFilterTab: IProductStatus = IProductStatus.ALL;


  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setIsOpenProductStatusChangeModal = (isOpen: boolean) => {
    this.isOpenProductStatusChangeModal = isOpen;
  };

  setSingleProduct = (singleProduct: IWarehouseOrders | null) => {
    this.singleProduct = singleProduct;
  };

  setProductStatusFilterTab = (productStatusFilterTab: IProductStatus) => {
    this.productStatusFilterTab = productStatusFilterTab;
  };

  reset() {
    this.pageNumber = 10;
  }
}

export const applyProductsQaStore = new ApplyProductsQaStore();
