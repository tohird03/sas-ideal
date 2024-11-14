export interface IGetRoleByNameParams {
  role: string;
}

export interface IPermession {
  [x: string]: any;
  id: string;
  name: string;
  status: boolean;
}

export interface IAddRoleParams {
  name: string;
}

export interface IAssignAndUnAssignPerToRoleParams {
  roleId: string;
  permissions: IPermession[];
}
