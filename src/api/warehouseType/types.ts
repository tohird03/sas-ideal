import {IPagination} from '../types';

export interface IGetWarehouseTypeParams extends IPagination {
  name?: string;
}

export interface IGetWarehouseTypeData {
  count: number;
  warehouseTypeList: IWarehouseType[];
}

export interface IWarehouseType {
  id: string;
  name: string;
  createdAt: string;
}

export interface IAddEditWarehouseTypeParams {
  id?: string;
  name: string;
}
