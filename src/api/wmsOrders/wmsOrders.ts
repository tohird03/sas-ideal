import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '@/api/endpoints';
import {INetworkConfig, Instance} from '@/api/instance';
import {IGetWarehouseOrdersData, IProviderProductStatusChange, IWarehouseOrdersParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class WarehouseOrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProviderOrders = (params: IWarehouseOrdersParams): Promise<IGetWarehouseOrdersData> =>
    this.get(Endpoints.WmsProviderOrders, {params});

  providerProductStatusChange = (params: IProviderProductStatusChange): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsProviderOrders}/${params?.productId}`, {status: params?.status});
}

export const warehouseOrdersApi = new WarehouseOrdersApi(config);
