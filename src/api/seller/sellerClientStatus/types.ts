export interface IClientStatus {
  id: string;
  name: string;
}

export interface IGetClientStatusParams {
  name?: string;
}

export interface IAddEditClientStatus {
  id?: string;
  name: string;
}
