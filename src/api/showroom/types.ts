import {IPagination} from '../types';

export interface IGetAllShowroom {
  count: number;
  showroomList: IShowroom[];
}
export interface IShowroom {
  id: string;
  name: string;
  address: string;
  sellerId: string;
  createdAt: string;
}

export interface IAddNewShowroom {
  name: string;
  address: string;
  showroomId?: string;
  sellerId?: string;
}

export interface IGetShowroomUsers extends IPagination {
  showroomId: string;
}
