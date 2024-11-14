import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddModel, IGetModel, IModelParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class ModelApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProcess = (params: IModelParams): Promise<IGetModel> =>
    this.get(Endpoints.Model, {params});

  getModelSelect = (pageSize=1000): Promise<IGetModel> =>
    this.get(`${Endpoints.Model}?pageSize=${pageSize}`);

  addModel = (params: IAddModel): Promise<AxiosResponse> =>
    this.post(Endpoints.Model, params);

  updateModel = (params: IAddModel): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Model}/${params?.id}`, params);

  deleteModel = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Model}/${id}`);

}

export const modelApi = new ModelApi(config);
