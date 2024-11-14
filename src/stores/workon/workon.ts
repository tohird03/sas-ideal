import {makeAutoObservable} from 'mobx';
import {IWorkOnTabs} from '@/pages/Tasks/WorkOn/types';

class WorkOnStore {
  isOpenEditProductModal = false;
  isEditTabModal = false;
  isTabsIndex = IWorkOnTabs.Product;
  isAddTabsModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  seIsOpenEditProductModal = (isOpen: boolean) => {
    this.isOpenEditProductModal = isOpen;
  };

  setIsOpenEditTabModal = (isOpen: boolean) => {
    this.isEditTabModal = isOpen;
  };

  setIsTabsIndex = (isTabs: IWorkOnTabs.Product) => {
    this.isTabsIndex = isTabs;
  };

  setIsAddTabsModal = (isOpen: boolean) => {
    this.isAddTabsModal = isOpen;
  };

  reset() {
    this.isEditTabModal = false;
  }
}

export const workOnStore = new WorkOnStore();
