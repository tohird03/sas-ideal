import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IGetGeneratePartId, IGetWmsProvidersStorekeeperProductsParams, IProvidersStorekeeperProducts, IProviderUploadProduct} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class WmsProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProvidersStorekeeperProducts = (params: IGetWmsProvidersStorekeeperProductsParams): Promise<IProvidersStorekeeperProducts> =>
    this.get(Endpoints.WmsStorekeeperProductsGet, {params});

  providerUploadProduct = (params: IProviderUploadProduct): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsProviderUploadProduct, params);

  getGeneratePartIdToNewProducts = (): Promise<IGetGeneratePartId> =>
    this.get(Endpoints.WmsGeneratePartId);
}

export const wmsProductsApi = new WmsProductsApi(config);
