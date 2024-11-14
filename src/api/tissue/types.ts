import {IPagination} from '../types';

export interface IGetTissueData {
  count: number;
  tissueList: ITissue[];
}

export interface ITissue {
  id: string;
  name: string;
  createdAt: string;
}

export interface IGetTissueParams extends IPagination {
  name: string;
}

export interface IGetTissueColorData {
  count: number;
  tissueColorList: ITissueColor[];
}

export interface ITissueColor {
  id: string;
  name: string;
  hexColor: string;
  createdAt: string;
  tissue?: ITissue;
}

export interface IGetTissueColorParams extends IPagination {
  name: string;
}
