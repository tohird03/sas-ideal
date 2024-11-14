import {makeAutoObservable} from 'mobx';
import {ICourier} from '@/api/courier/types';
import {IUser} from '@/api/users/types';

class CourierStores {
  searchPhone: string | null = null;
  searchName: string | null = null;
  pageNumber = 1;
  pageSize = 10;
  isOpenAddEditCourierModal = false;
  singleCourier: ICourier | null = null;
  isOpenHaveOldUserUpdate = false;
  oldUser: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchPhone = (searchPhone: string | null) => {
    this.searchPhone = searchPhone;
  };

  setSearchName = (searchName: string | null) => {
    this.searchName = searchName;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setIsOpenAddEditCourierModal = (isOpen: boolean) => {
    this.isOpenAddEditCourierModal = isOpen;
  };

  setSingleCourier = (singleCourier: ICourier | null) => {
    this.singleCourier = singleCourier;
  };

  setIsOpenHaveOldUserUpdate = (isOpen: boolean) => {
    this.isOpenHaveOldUserUpdate = isOpen;
  };

  setOldUser = (oldUser: IUser | null) => {
    this.oldUser = oldUser;
  };

  reset() {
    this.isOpenAddEditCourierModal = false;
  }
}

export const courierStores = new CourierStores();
