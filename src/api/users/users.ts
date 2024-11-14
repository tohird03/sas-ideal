import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IAddUser,
  IAllCompanies,
  IEditUser,
  IGetMainSellerUsersData,
  IGetMainSellerUsersParams,
  IGetProviderUsersParams,
  IGetRolePermession,
  IGetUserProviderParams,
  IGetUsersByRoleParams,
  IRemoveUserFromShowroom,
  IResetPassword,
  IRevokeUser,
  IRole,
  IRoleUserByPermession,
  IUser,
  IUserData,
  IUserParams,
  IUserProviderEdit,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class UsersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getUsers = (params: IUserParams): Promise<IUserData> =>
    this.get(Endpoints.Users, {
      params: {
        pageNumber: params.page,
        pageSize: params.pageSize,
        search: params?.search,
        company: params?.company,
      },
    });


  getUsersByRole = (params: IGetUsersByRoleParams): Promise<IUserData> =>
    this.get(Endpoints.UsersByRole, {params});

  addUser = (params: IAddUser): Promise<AxiosResponse> =>
    this.post(Endpoints.Users, params);

  editUser = (params: IEditUser): Promise<AxiosResponse> =>
    this.patch(Endpoints.DeleteUser.replace('{id}', params?.id!), {
      ...params,
      connectPriviliges: {
        role: params?.priviliges?.connectPrivigilas?.role,
        permissions: params?.priviliges?.connectPrivigilas?.permessions,
      },
      disconnectPriviliges: {
        role: params?.priviliges?.disconnectPrivigilas?.role,
        permissions: params?.priviliges?.disconnectPrivigilas?.permessions,
      },
      priviliges: [],
    });

  deleteUser = (id: string) =>
    this.delete(Endpoints.DeleteUser.replace('{id}', id));

  getSingleUser = (id: string): Promise<IUser> =>
    this.get(Endpoints.GetSingleUser.replace('{id}', id));

  getAllRole = (): Promise<IRole[]> =>
    this.get(Endpoints.AllRoles);

  getSingleRole = (roleId: string): Promise<IRole> =>
    this.get(Endpoints.SingleRole.replace('{id}', roleId));

  getAllCompanies = (): Promise<IAllCompanies[]> =>
    this.get(Endpoints.AllCompanies);

  resetPassword = (params: IResetPassword): Promise<AxiosResponse> =>
    this.patch(Endpoints.UserResetPassword.replace('{id}', params?.id), {password: params?.password});

  getSingleRoleByUserByPermession = (params: IGetRolePermession): Promise<IRoleUserByPermession> =>
    this.get(`${Endpoints.PmsRolePermession}/${params?.roleId}/${params?.userId}`);

  addUserToShowroom = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.post(Endpoints.AddUserToShowroom, params);

  editUserToShowroom = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.patch(`${Endpoints.AddUserToShowroom}/${params?.id}`, params);

  removeUserFromShowroom = (params: IRemoveUserFromShowroom): Promise<AxiosResponse> =>
    this.post(Endpoints.RemoveUserFromShowroom, params);

  connectUserToShowroom = (params: IRemoveUserFromShowroom): Promise<AxiosResponse> =>
    this.post(Endpoints.ConnectUserToShowroom, params);

  addUserToWarehouse = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.post(Endpoints.AddUserToWarehouse, params);

  editUserFromWarehouse = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.patch(`${Endpoints.AddUserToWarehouse}/${params?.id}`, params);

  revokeRole = (params: IRevokeUser): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.UmsRevokeUser}/${params?.userId}`, params);

  getProvider = (params: IGetUserProviderParams): Promise<IUserData> =>
    this.get(Endpoints.UmsProvider, {params});

  addProvider = (params: IAddUser): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsProvider, params);

  editProvider = (params: IUserProviderEdit): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.UmsProvider}/${params?.userId}`, params);

  deleteProvider = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsProvider}/${id}`);

  getProviderUsers = (params: IGetProviderUsersParams): Promise<IUserData> =>
    this.get(Endpoints.UmeProviderUsers, {params});

  addProviderUsers = (params: IAddUser): Promise<AxiosResponse> =>
    this.post(Endpoints.UmeProviderUsersAdd, params);

  getMainSellerUsers = (params: IGetMainSellerUsersParams): Promise<IGetMainSellerUsersData> =>
    this.get(Endpoints.UmsMainSellerUsers, {params});

  mainSellerAddSeller = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.post(Endpoints.UmsMainSellerUsers, params);

  mainSellerDeleteSeller = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsMainSellerUsers}/${id}`);
}

export const usersApi = new UsersApi(config);
