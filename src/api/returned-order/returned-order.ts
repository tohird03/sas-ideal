import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddReturnedOrders, IGetReturnedOrdersParams, IReturnedOrder } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ReturnedOrderApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getReturnedOrders = (params: IGetReturnedOrdersParams): Promise<IResponse<IReturnedOrder[]>> =>
    this.get(Endpoints.returnedOrder, { params });

  addReturnedOrder = (params: IAddReturnedOrders): Promise<IReturnedOrder> =>
    this.resPost(Endpoints.returnedOrder, params);

  getSingleReturnedOrder = (orderId: string): Promise<IReturnedOrder> =>
    this.get(`${Endpoints.returnedOrder}/${orderId}`);

  // updatePayment = (params: IAddEditPaymentParams): Promise<AxiosResponse> =>
  //   this.patch(`${Endpoints.payment}/${params?.id}`, params);

  // deletePayment = (id: string): Promise<AxiosResponse> =>
  //   this.delete(`${Endpoints.payment}/${id}`);
}

export const returnedOrderApi = new ReturnedOrderApi(config);
