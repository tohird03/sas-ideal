import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IGetIncomeProductsParams, IIncomeProduct } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class IncomeProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomeOrder = (params: IGetIncomeProductsParams): Promise<IResponse<IIncomeProduct[]>> =>
    this.get(Endpoints.products, {params});
}

export const incomeProductsApi = new IncomeProductsApi(config);
