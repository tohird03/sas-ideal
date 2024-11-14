import {makeAutoObservable} from 'mobx';
import {providerApi} from '@/api/provider/provider';
import {
  IProviderEdit,
  IProviderList,
  IProviderNotificationTabStatus,
} from '@/api/provider/types';
import {IPagination} from '@/api/types';
import {addNotification} from '@/utils';

class ProviderStore {
  pageSize = 10;
  pageNumber = 1;
  isOpenAddProviderModal = false;
  editSingleProvider: IProviderList | null = null;

  providerNotificationTabKey = IProviderNotificationTabStatus.Notifications;
  isOpenProviderMainAddEditModal = false;
  isOpenProviderAdminAddEditModal = false;
  isOpenProviderBranchAddEditModal = false;
  isOpenProviderListProcessEditModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  getProvider = (params: IPagination) =>
    providerApi.getProvider(params)
      .then((res) => res)
      .catch(addNotification);

  addProvider = (params: IProviderEdit) =>
    providerApi.addProvider(params)
      .then((res) => {
        addNotification('Успешное добавление нового поставщика');

        return res;
      })
      .catch(addNotification);

  editProvider = (params: IProviderEdit) =>
    providerApi.editProvider(params)
      .then((res) => {
        addNotification('Изменить поставщика успеха');

        return res;
      })
      .catch(addNotification);

  deleteProvider = (id: string) =>
    providerApi.deleteProvider(id)
      .then((res) => res)
      .catch(addNotification);

  setEditSingleProvider = (singleProvider: IProviderList | null) => {
    this.editSingleProvider = singleProvider;
  };

  setIsProviderNotificationTabKey = (tabKey: IProviderNotificationTabStatus) => {
    this.providerNotificationTabKey = tabKey;
  };

  setIsOpenProviderMainAddEditModal = (isOpen: boolean) => {
    this.isOpenProviderMainAddEditModal = isOpen;
  };

  setIsOpenProviderAdminAddEditModal = (isOpen: boolean) => {
    this.isOpenProviderAdminAddEditModal = isOpen;
  };

  setIsOpenProviderBranchAddEditModal = (isOpen: boolean) => {
    this.isOpenProviderBranchAddEditModal = isOpen;
  };

  setIsOpenProviderListProcessEditModal = (isOpen: boolean) => {
    this.isOpenProviderListProcessEditModal = isOpen;
  };

  setIsOpenProviderModal = (isOpen: boolean) => {
    this.isOpenAddProviderModal = isOpen;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

}

export const providerStore = new ProviderStore();
