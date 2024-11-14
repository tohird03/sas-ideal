import {makeAutoObservable} from 'mobx';
import {tissueApi} from '@/api/tissue';
import {IGetTissueColorParams, IGetTissueParams} from '@/api/tissue/types';
import {addNotification} from '@/utils';

class TissueStore {
  constructor() {
    makeAutoObservable(this);
  }

  getTissue = (params: IGetTissueParams) =>
    tissueApi.getTissue(params)
      .then(res => res)
      .catch(addNotification);

  getTissueColor = (params: IGetTissueColorParams) =>
    tissueApi.getTissueColor(params)
      .then(res => res)
      .catch(addNotification);

  reset() {

  }
}

export const tissueStore = new TissueStore();
