import {IPagination} from '@/api/types';

export interface IClientFrom {
  id: string;
  name: string;
}

// export interface IGetClientFromData {

// }

export interface IGetClientFromParams extends IPagination {
  name?: string;
}

export interface IAddEditClientFrom {
  id?: string;
  name: string;
}
