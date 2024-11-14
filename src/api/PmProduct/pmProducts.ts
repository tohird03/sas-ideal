import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IPmProductAdd,
  IPmsBulkUpdate,
  IProductListData,
  IProductListParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: pmsStages.apiUrl,
};

class PmProductApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPmProductList = (params: IProductListParams): Promise<IProductListData> =>
    this.get(Endpoints.PmsPmProductsGet, {params});

  postProductList = (params: IPmProductAdd) =>
    this.post(Endpoints.PmsPmProductAdd, params);

  patchProductsBulkUpdate = (params: IPmsBulkUpdate) =>
    this.patch(`${Endpoints.PmsPmPiceFactorBulkUpdate}`, params);

  deleteProduct = (id: string) =>
    this.delete(`${Endpoints.PmsPmProductAdd}/${id}`);
}


export const pmProductApi = new PmProductApi(config);
