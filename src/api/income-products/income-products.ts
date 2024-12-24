import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditIncomeOrder, IGetIncomeOrdersParams, IIncomeOrder, IIncomeOrderProductAdd, IIncomeUpdateOrderProduct, IUpdateIncomeOrder } from './types';
import { IUpdateOrder } from '../order/types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class IncomeProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomeOrder = (params: IGetIncomeOrdersParams): Promise<IResponse<IIncomeOrder[]>> =>
    this.get(Endpoints.productsIncomeOrder, { params });

  addNewIncomeOrder = (params: IAddEditIncomeOrder): Promise<IIncomeOrder> =>
    this.resPost(Endpoints.productsIncomeOrder, params);

  updateIncomeOrder = (params: IUpdateIncomeOrder): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsIncomeOrder}/${params?.id}`, params);

  getSingleIncomeOrder = (orderId: string): Promise<IIncomeOrder> =>
    this.get(`${Endpoints.productsIncomeOrder}/${orderId}`);

  orderProductAdd = (params: IIncomeOrderProductAdd): Promise<AxiosResponse> =>
    this.post(Endpoints.productsIncomeOrderProduct, params);

  updateOrderProduct = (params: IIncomeUpdateOrderProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsIncomeOrderProduct}/${params?.id}`, params);

  deleteOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.productsIncomeOrderProduct}/${productId}`);

}

export const incomeProductsApi = new IncomeProductsApi(config);
