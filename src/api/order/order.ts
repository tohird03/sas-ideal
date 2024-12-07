import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IGetOrdersParams, IOrder } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class OrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrders = (params: IGetOrdersParams): Promise<IResponse<IOrder[]>> =>
    this.get(Endpoints.productsOrder, {params});
}

export const ordersApi = new OrdersApi(config);
