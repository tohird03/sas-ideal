export enum IProviderNotificationTabStatus {
  Notifications = 'Уведомления',
  MyApplications = 'Мои заявки',
}


export interface IProviderList {
  id: string;
  name: string;
}

export interface IProviderData {
  count: number;
  providerList: IProviderList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IProviderMainType {
  id: string;
  productId: string;
  category: string;
  model: string;
  type: string;
  status: any;
  tissue: string;
  note: string;
  qty: string;
}

export interface IProviderEdit {
  id?: string;
  name: string;
}
