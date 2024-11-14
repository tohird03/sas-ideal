import {Endpoints, smsStages} from '../../endpoints';
import {INetworkConfig, Instance} from '../../instance';
import {IGetSellerNewProductParams, IGetSellerNewProducts} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class SellerProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getSellerNewProducts = (params: IGetSellerNewProductParams): Promise<IGetSellerNewProducts> =>
    this.get(Endpoints.SmsNewProducts, {params});
}

export const sellerProductsApi = new SellerProductsApi(config);
