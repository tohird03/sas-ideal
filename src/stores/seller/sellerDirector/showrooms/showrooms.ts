import {makeAutoObservable} from 'mobx';
import {IShowroom} from '@/api/showroom/types';
import {IUser} from '@/api/users/types';
import {IShowroomUsersCanbanType} from './types';

class SellerShowroomsStore {
  isOpenAddEditShowroomModal = false;
  singleShowroom: IShowroom | null = null;
  showroomUsers: IShowroomUsersCanbanType[] = [];
  isActiveShowroomUsersId: string | null = null;
  singleSeller: IUser | null = null;
  isOpenAddEditSellerModal = false;
  isOpenHaveUserErrorModal = false;
  whileAddUserHaveOldUser: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsOpenAddEditShowroomModal = (isOpen: boolean) => {
    this.isOpenAddEditShowroomModal = isOpen;
  };

  setSingleShowroom = (singleShowroom: IShowroom | null) => {
    this.singleShowroom = singleShowroom;
  };

  setShowroomuser = (showroomUser: IShowroomUsersCanbanType[]) => {
    this.showroomUsers = showroomUser;
  };

  setIsActiveShowroomUsersId = (isActiveShowroomUsersId: string | null) => {
    this.isActiveShowroomUsersId = isActiveShowroomUsersId;
  };

  setSingleUser = (singleUser: IUser | null) => {
    this.singleSeller = singleUser;
  };

  setIsOpenAddEditSellerModal = (isOpen: boolean) => {
    this.isOpenAddEditSellerModal = isOpen;
  };

  setIsOpenHaveUserErrorModal = (isOpen: boolean) => {
    this.isOpenHaveUserErrorModal = isOpen;
  };

  setWhileAddUserHaveOldUser = (whileAddUserHaveOldUser: IUser | null) => {
    this.whileAddUserHaveOldUser = whileAddUserHaveOldUser;
  };

  reset() {
    this.isOpenAddEditShowroomModal = false;
  }
}

export const sellerShowroomsStore = new SellerShowroomsStore();
