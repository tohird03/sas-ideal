import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IGetCategoryListResponse} from '../storekeeper/types';
import {
  IGetCategoryParams,
  IGetDirectionListResponse,
  IGetManagerTissue,
  IGetManagerTissueList,
  IGetManagerTissueParams,
  IGetModelListResponse,
  IGetProductStatusListResponse,
  IGetProviderListResponse,
  IPatchManagerTissue,
  IPmsOneParams,
  IPostManagerTissue,
} from './tyes';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class ProductManagerApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getTissue = (params: IGetManagerTissueParams): Promise<IGetManagerTissue> =>
    this.get(`${Endpoints.PmsTissue}`, {params});

  postTissue = (params: IPostManagerTissue) =>
    this.post(Endpoints.PmsTissue, params);

  patchTissue = (params: IPatchManagerTissue): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsTissue}/${params.id}`, params);

  deleteTissue = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsTissue}/${id}`);

  getColorByTissue = (id: string): Promise<IGetManagerTissueList> =>
    this.get(`${Endpoints.PmsTissue}/${id}`);

  postColorByTissue = (params: IGetManagerTissueList) =>
    this.post(Endpoints.PmsColorByTissue, params);

  patchColorByTissue = (
    params: IGetManagerTissueList
  ): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsColorByTissue}/${params.id}`, params);

  deleteColorByTissue = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsColorByTissue}/${id}`);

  getCategory = (
    params: IGetCategoryParams
  ): Promise<IGetCategoryListResponse> =>
    this.get(Endpoints.Category, {params});

  getModel = (
    params: IGetManagerTissueParams
  ): Promise<IGetModelListResponse> => this.get(Endpoints.Model, {params});

  getDirections = (params: IPmsOneParams): Promise<IGetDirectionListResponse> =>
    this.get(Endpoints.Direction, {params});

  getProductStatus = (
    params: IPmsOneParams
  ): Promise<IGetProductStatusListResponse> =>
    this.get(Endpoints.WmsProductStatusGet, {params});

  getProviders = (params: IPmsOneParams): Promise<IGetProviderListResponse> =>
    this.get(Endpoints.Provider, {params});
}


export const productManagerApi = new ProductManagerApi(config);
