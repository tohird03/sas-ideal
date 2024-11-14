import {makeAutoObservable} from 'mobx';
import {pmProductApi} from '@/api/PmProduct/pmProducts';
import {IProductListParams} from '@/api/PmProduct/types';
import {addNotification} from '../../utils/addNotification';

class PmProductListStore {
  pageSize = 10;
  pageNumber = 1;
  search = '';

  constructor() {
    makeAutoObservable(this);
  }

  getPmProductList = (params: IProductListParams) =>
    pmProductApi.getPmProductList(params)
      .then((res) => res).catch(addNotification);

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

}

export const pmProductListStore = new PmProductListStore();
