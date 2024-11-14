import {IPagination} from '../types';

export interface IGetLocationsParams extends IPagination {
  name?: string;
}

export interface IGetLocationsData {
  locationList: ILocation[];
  count: number;
}

export interface ILocation {
  id: string;
  name: string;
}

export interface IAddEditLocation {
  id?: string;
  name: string;
}
