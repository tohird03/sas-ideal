import {makeAutoObservable} from 'mobx';
import {
  IAddUser,
  IAllCompanies,
  IEditUser,
  IGetRolePermession,
  IResetPassword,
  IRole,
  IUser,
  IUserParams,
} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {addNotification} from '@/utils/addNotification';

class UsersStore {
  users: IUser[] = [];
  totaluser = 0;
  page = 1;
  limit = 10;
  search = '';
  phone = '';
  company: string | null = null;
  searchBy = '';
  isOpenAddUserModal = false;
  isOpenCompaniesModal = false;
  isOpenResetPasswordModal = false;
  isOpenRolesModal = false;
  singleUser: IUser | null = null;
  allRoles: IRole[] = [];
  allCompanies: IAllCompanies[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = (params: IUserParams) =>
    usersApi.getUsers(params)
      .then(res => {
        if (res) {
          this.setUsers(res.userList);
          this.setTotalUsers(res.count);
        }

        return res;
      })
      .catch(addNotification);

  addUsers = (params: IAddUser) =>
    usersApi.addUser(params)
      .then(res => {
        if (res?.status === 204) {
          addNotification('Успешно добавлено нового пользователя');
        }

        return res;
      })
      .catch(addNotification);

  addUserToShowroom = (params: IAddUser) =>
    usersApi.addUserToShowroom(params)
      .then(res => {
        if (res?.status === 204) {
          addNotification('Успешно добавлено нового пользователя');
        }

        return res;
      })
      .catch(addNotification);

  editUser = (params: IEditUser) =>
    usersApi.editUser(params)
      .then(res => {
        if (res?.status === 204) {
          addNotification('Успешно изменять пользователя');
        }

        return res;
      })
      .catch(addNotification);

  deleteUser = (id: string) =>
    usersApi.deleteUser(id)
      .then(res => {
        if (res?.status === 204) {
          addNotification('Успешное удаление пользователя');
        }

        return res;
      })
      .catch(addNotification);

  getSingleUser = (id: string) =>
    usersApi.getSingleUser(id)
      .then(res => {
        if (res) {
          this.setSingleUser(res);
        }

        return res;
      })
      .catch(addNotification);

  getAllRole = () =>
    usersApi.getAllRole()
      .then(res => {
        if (res) {
          this.setAllRole(res);
        }

        return res;
      })
      .catch(addNotification);

  getSingleRole = (id: string) =>
    usersApi.getSingleRole(id)
      .then(res => res)
      .catch(addNotification);

  getSingleRoleUserByPermession = (params: IGetRolePermession) =>
    usersApi.getSingleRoleByUserByPermession(params)
      .then(res => res)
      .catch(addNotification);

  getAllCompanies = () =>
    usersApi.getAllCompanies()
      .then(res => {
        if (res) {
          this.setAllCompanies(res);
        }

        return res;
      })
      .catch(addNotification);

  resetPassword = (params: IResetPassword) =>
    usersApi.resetPassword(params)
      .then(res => {
        addNotification('Успешный сброс пароля');

        return res;
      })
      .catch(addNotification);

  setUsers = (users: IUser[]) => {
    this.users = users;
  };

  setPage = (page: number) => {
    this.page = page;
  };

  setLimit = (limit: number) => {
    this.limit = limit;
  };

  setTotalUsers = (totalUsers: number) => {
    this.totaluser = totalUsers;
  };

  setIsOpenAddUserModal = (isOpen: boolean) => {
    this.isOpenAddUserModal = isOpen;
  };

  setIsOpenCompaniesModal = (isOpen: boolean) => {
    this.isOpenCompaniesModal = isOpen;
  };

  setIsOpenResetPasswordModal = (isOpen: boolean) => {
    this.isOpenResetPasswordModal = isOpen;
  };

  setIsOpenRolesModal = (isOpen: boolean) => {
    this.isOpenRolesModal = isOpen;
  };

  setSingleUser = (singleUser: IUser | null) => {
    this.singleUser = singleUser;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setSearchBy = (searchBy: string) => {
    this.searchBy = searchBy;
  };

  setCompany = (company: string | null) => {
    this.company = company;
  };

  setAllRole = (allRole: IRole[]) => {
    this.allRoles = allRole;
  };

  setAllCompanies = (allCompanies: IAllCompanies[]) => {
    this.allCompanies = allCompanies;
  };

  reset() {
    this.users = [];
  }
}

export const usersStore = new UsersStore();
