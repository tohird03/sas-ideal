import {IPagination} from '../types';

export interface IGetCourierParams extends IPagination {
  tgStatus?: string;
  phone?: string;
  name?: string;
}

export interface IGetCourierData {
  courierList: ICourier[];
  count: number;
}

export interface ICourier {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  phone: string;
  tgStatus: CourierTgStatus;
  username: string;
  userId: string;
}

export enum CourierTgStatus {
  Active = 'active',
  Disactive = 'disactive',
  Blocked = 'blocked',
}

export interface ICourierChangeTgStatus {
  tgStatus: CourierTgStatus;
  userId: string;
}
