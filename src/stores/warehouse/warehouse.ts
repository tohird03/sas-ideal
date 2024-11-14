import {makeAutoObservable} from 'mobx';
import {wmsWarehouseApi} from '@/api/wmsWarehouses';
import {IGetWarehouseParams, IGetWarehouseTypeParams} from '@/api/wmsWarehouses/types';
import {addNotification} from '@/utils';
import {IWarehouseUsersCanbanType} from './types';

class WarehouseStore {
  isActiveWarehouseUsersId: string | null = null;
  warehouseUsers: IWarehouseUsersCanbanType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getAllWarehouses = () =>
    wmsWarehouseApi.getAllWarehouses()
      .then(res => res)
      .catch(addNotification);

  getWarehouses = (params: IGetWarehouseParams) =>
    wmsWarehouseApi.getWarehouses(params)
      .then(res => res)
      .catch(addNotification);

  getWarehouseTypes = (params: IGetWarehouseTypeParams) =>
    wmsWarehouseApi.getWarehouseTypes(params)
      .then(res => res)
      .catch(addNotification);

  setIsActiveWarehouseUsersId = (activeWarehouseUsersId: string | null) => {
    this.isActiveWarehouseUsersId = activeWarehouseUsersId;
  };

  setWarehouseUsers = (warehouseUsers: IWarehouseUsersCanbanType[]) => {
    this.warehouseUsers = warehouseUsers;
  };

  reset() {
    this.isActiveWarehouseUsersId = null;
  }
}

export const warehouseStore = new WarehouseStore();
