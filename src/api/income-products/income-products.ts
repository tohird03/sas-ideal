import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IGetIncomeOrdersParams, IIncomeOrder } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class IncomeProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomeOrder = (params: IGetIncomeOrdersParams): Promise<IResponse<IIncomeOrder[]>> =>
    this.get(Endpoints.productsIncomeOrder, {params});
}

export const incomeProductsApi = new IncomeProductsApi(config);
