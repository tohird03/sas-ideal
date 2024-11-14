import {IPagination} from '../types';
export interface IMyLogs {
  id: string;
  description: string;
  status: string;
  type: string;
  product: IProduct;
}

export interface IGetMyLogs {
  taskList: IMyLogs[];
  count: number;
}

export interface IProduct {
  model: IMyLogModel;
  category: IMyLogCategory;
}

export interface IMyLogCategory {
  id: string;
  title: string;
}
export interface IMyLogModel {
  id: string;
  name: string;
}

export interface IMyLogId {
  id: string;
  description: string;
  status: string;
  type: string;
}

export interface IMyLogsParams extends IPagination {
  category?: string;
  seller: string;
  model: string;
  date: string;
}
