import {IPagination} from '../types';

export interface IGetDirectionParams extends IPagination {
  title?: string;
}

export interface IGetDirectionData {
  count: number;
  directionList: IDirection[];
}

export interface IDirection {
  id: string;
  title: string;
  createdAt: string;
}

export interface IAddEditDirectionParams {
  id?: string;
  title: string;
}
