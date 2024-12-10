import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddOrder, IGetOrdersParams, IOrder, IUpdateOrder } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class OrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrders = (params: IGetOrdersParams): Promise<IResponse<IOrder[]>> =>
    this.get(Endpoints.productsOrder, { params });

  addNewOrder = (params: IAddOrder): Promise<AxiosResponse> =>
    this.post(Endpoints.productsOrder, params);

  updateOrder = (params: IUpdateOrder): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsOrder}/${params?.id}`, params);

  deleteOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.productsOrder}/${id}`);
}

export const ordersApi = new OrdersApi(config);
