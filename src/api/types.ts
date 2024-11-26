import {TagProps} from 'antd';

type TError = {
  errId: number;
  errMsg: string | string[];
  isFriendly: boolean;
};

export interface IResponse<TBody> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  data: TBody;
}

export interface IOneElement {
  id: string;
  name: string;
}


export interface ISuccessResponse {
  success: boolean;
}

export interface IPagination {
  pageNumber?: number;
  pageSize?: number;
  description?: string;
}

export type TStage = {
  apiUrl: string;
  cdnHost?: string;
};

export enum IProductStatus {
  ALL = 'all',
  NEW = 'new',
  CHECKED = 'checked',
  PROCESS = 'process',
  DONE = 'done',
}

export const ProductStatusColor: Record<IProductStatus, TagProps['color']> = {
  [IProductStatus.ALL]: '#0352fc',
  [IProductStatus.NEW]: '#0352fc',
  [IProductStatus.CHECKED]: '#fc03df',
  [IProductStatus.PROCESS]: '#e07000',
  [IProductStatus.DONE]: '#06a800',
};

export const ProductStatusText = {
  [IProductStatus.ALL]: 'Все',
  [IProductStatus.NEW]: 'Новый',
  [IProductStatus.CHECKED]: 'Проверено',
  [IProductStatus.PROCESS]: 'В процессе',
  [IProductStatus.DONE]: 'Готово',
};

export enum IUsersRoles {
  Provider = 'provider',
  Storekeeper = 'storekeeper',
  ProviderQa = 'provider-qa',
}
