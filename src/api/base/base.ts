import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IBaseAdd, IBaseCategoryParams, IBaseData, IBaseEdit, IBaseParams, IUnitParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class BaseApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }
  getBases = (
    params: IBaseParams
  ): Promise<IBaseData> =>
    this.get(Endpoints.GetBase, {
      params: {
        name: params?.name,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        baseCategoryId: params?.baseCategoryId,
      },
    });

  getBaseUnit = (): Promise<IUnitParams> =>
    this.get(Endpoints.PmsUnit, {pageNumber: 1, pageSize: 1000});

  getBaseCategory = ():
  Promise<IBaseCategoryParams> =>
    this.get(Endpoints.PmsBaseCategory, {pageNumber: 1, pageSize: 1000});

  postBases = (params: IBaseAdd) =>
    this.post(`${Endpoints.PostBase}`, params);

  deleteBase = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsDeleteBase}/${id}`);

  editBase = (id: string, params: IBaseEdit): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsBaseEdit}/${id}`, params);
}


export const basesApi = new BaseApi(config);
