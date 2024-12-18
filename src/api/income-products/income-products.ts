import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditIncomeOrder, IGetIncomeOrdersParams, IIncomeOrder, IUpdateIncomeOrder } from './types';
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

  addNewIncomeOrder = (params: IAddEditIncomeOrder): Promise<AxiosResponse> =>
    this.post(Endpoints.productsIncomeOrder, params);

  updateIncomeOrder = (params: IUpdateIncomeOrder): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsIncomeOrder}/${params?.id}`, params);
}

export const incomeProductsApi = new IncomeProductsApi(config);
