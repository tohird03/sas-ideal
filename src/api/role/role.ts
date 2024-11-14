import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IRole} from '../users/types';
import {IAddRoleParams, IAssignAndUnAssignPerToRoleParams, IGetRoleByNameParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class RoleApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllRoles = (): Promise<IRole[]> =>
    this.get(Endpoints.UmsAllRoles);

  addRole = (params: IAddRoleParams): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsAddRole, params);

  deleteRole = (roleId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsDeleteRole}/${roleId}`);

  getRoleByName = (params: IGetRoleByNameParams): Promise<IRole> =>
    this.get(Endpoints.RoleByName, {params});

  getPerByRole = (roleId: string): Promise<IRole> =>
    this.get(Endpoints.UmsPermessionByRole.replace('{id}', roleId));

  assignPer = (assignPerParams: IAssignAndUnAssignPerToRoleParams): Promise<AxiosResponse> =>
    this.put(Endpoints.UmsAssignPerToRole, assignPerParams);

  unAssignPer = (assignPerParams: IAssignAndUnAssignPerToRoleParams): Promise<AxiosResponse> =>
    this.put(Endpoints.UmsUnAssignPerToRole, assignPerParams);
}

export const roleApi = new RoleApi(config);
