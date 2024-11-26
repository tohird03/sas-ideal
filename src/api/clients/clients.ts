import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IResponse} from '../types';
import { IAddEditClientInfo, IClientsInfo, IGetClientsInfoParams } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
    this.get(Endpoints.ClientsInfo, {params});

  clientsAddClient = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.ClientsAddClient, params);

  clientsAddSupplier = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.ClientsAddSupplier, params);

  updateClient = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.ClientsInfo}/${params?.id}`, params);

  deleteClient = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.ClientsInfo}/${id}`);
}

export const clientsInfoApi = new ClientsInfoApi(config);
