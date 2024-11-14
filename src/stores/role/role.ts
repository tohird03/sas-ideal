import {makeAutoObservable} from 'mobx';
import {roleApi} from '@/api/role';
import {IGetRoleByNameParams} from '@/api/role/types';
import {addNotification} from '@/utils/addNotification';

class RoleStore {

  constructor() {
    makeAutoObservable(this);
  }

  getRoleByName = (params: IGetRoleByNameParams) =>
    roleApi.getRoleByName(params)
      .then(res => res)
      .catch(addNotification);

  reset() {
  }
}

export const roleStore = new RoleStore();
