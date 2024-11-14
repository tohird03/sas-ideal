import {IPagination} from '../types';

export interface IModel {
  id: string;
  name: string;
  qtyPerDay: number;
  category: {
    id: string;
    title: string;
  };
}

export interface IGetModel {
  count: number;
  modelList: IModel[];
}

export interface IModelParams extends IPagination {
  name: string;
  categoryId?: string;
}

export interface IAddModel {
  id?: string;
  name: string;
  categoryId: string;
  qtyPerDay: number;
}
