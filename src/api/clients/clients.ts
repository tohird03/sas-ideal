import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddClientInfo, IAddSupplierInfo, IClientsInfo, IGetClientsInfoParams, IGetSupplierInfoParams, ISupplierInfo, IUpdateUser } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
    this.get(Endpoints.Clients, { params });

  addClients = (params: IAddClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.Clients, params);

  getSupplierInfo = (params: IGetSupplierInfoParams): Promise<IResponse<ISupplierInfo[]>> =>
    this.get(Endpoints.Supplier, { params });

  addSupplier = (params: IAddSupplierInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.Supplier, params);

  // UPDATE
  updateUser = (params: IUpdateUser): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Users}/${params?.id}`, params);

  deleteUser = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Users}/${id}`);
}

export const clientsInfoApi = new ClientsInfoApi(config);
