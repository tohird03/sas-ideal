import {makeAutoObservable} from 'mobx';
import {roleApi} from '@/api/role';
import {IRole} from '@/api/users/types';
import {addNotification} from '@/utils';

class RolesStore {
  isOpenAddRoles = false;
  isOpenAssignPerModal = false;
  singleRole: IRole | null = null;
  activeRole: IRole | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getActiveRole = (activeRoleId: string) =>
    roleApi.getPerByRole(activeRoleId)
      .then(res => {
        this.setActiveRole(res);

        return res;
      })
      .catch(addNotification);

  setIsOpenAddRoles = (isOpen: boolean) => {
    this.isOpenAddRoles = isOpen;
  };

  setIsOpenAssignPerModal = (isOpen: boolean) => {
    this.isOpenAssignPerModal = isOpen;
  };

  setSingleRole = (singleRole: IRole | null) => {
    this.singleRole = singleRole;
  };

  setActiveRole = (activeRole: IRole | null) => {
    this.activeRole = activeRole;
  };

  reset() {
    this.isOpenAddRoles = false;
    this.isOpenAssignPerModal = false;
  }
}

export const rolesStore = new RolesStore();
