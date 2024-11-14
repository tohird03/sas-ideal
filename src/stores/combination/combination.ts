import {makeAutoObservable} from 'mobx';
import {combinationApi} from '@/api/combination/combination';
import {ICombinationParams} from '@/api/combination/types';
import {productApi} from '@/api/product_list/product_list';
import {
  IProductList,
  IProductWorkOn,
} from '@/api/product_list/types';
import {addNotification} from '../../utils/addNotification';

class CombinationStore {
  pageSize = 10;
  pageNumber = 1;

  constructor() {
    makeAutoObservable(this);
  }

  getCombination = (params: ICombinationParams) =>
    combinationApi.getCombination(params)
      .then((res) => {
        if (res) {
          return res;
        }
      })
      .catch(addNotification);

}

export const combinationStore = new CombinationStore();
