import {IPagination} from '@/api/types';
import {IClientFrom} from '../sellerClientFrom/types';
import {IClientStatus} from '../sellerClientStatus/types';

export interface IGetVisitedClientsParams extends IPagination {
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export interface IGetVisitedClients {
  count: number;
  data: IVisitedClients[];
}

export interface IVisitedClients {
  id: string;
  note: string;
  isBought: boolean;
  createdAt: string;
  client: IClient;
}

export interface IClient {
  id: string;
  name: string;
  phone: string;
  address: string;
  clientFrom: IClientFrom;
  clientStatus: IClientStatus;
}

export interface IAddVisitedClient {
  note: string;
  clientFromId: string;
  clientId?: string;
  name?: string;
  phone?: string;
  address?: string;
  clientStatusId?: string;
}


export interface IGetClientsParams extends IPagination {
  search?: string;
}

export interface IGetClientsData {
  count: number;
  clientList: IClient[];
}
