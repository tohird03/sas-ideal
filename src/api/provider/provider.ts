import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination} from '../types';
import {IProviderData, IProviderEdit} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: pmsStages.apiUrl,
};

class ProviderApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProvider = (params: IPagination): Promise<IProviderData> =>
    this.get(Endpoints.PmsProvider, params);

  addProvider = (params: IProviderEdit): Promise<AxiosResponse> =>
    this.post(Endpoints.PmsProvider, params);

  editProvider = (params: IProviderEdit): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsProvider}/${params?.id}`, params);

  deleteProvider = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsProvider}/${id}`);
}

export const providerApi = new ProviderApi(config);
