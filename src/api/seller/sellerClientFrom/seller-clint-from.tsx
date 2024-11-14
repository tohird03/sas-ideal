import {AxiosResponse} from 'axios';
import {Endpoints, smsStages} from '../../endpoints';
import {INetworkConfig, Instance} from '../../instance';
import {IAddEditClientFrom, IClientFrom, IGetClientFromParams} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class SellerClientFromApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClintsFrom = (params: IGetClientFromParams): Promise<IClientFrom[]> =>
    this.get(Endpoints.SmsClientFrom, {params});

  addClientFrom = (params: IAddEditClientFrom): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsClientFrom, params);

  updateClientFrom = (params: IAddEditClientFrom): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SmsClientFrom}/${params?.id}`, params);

}

export const sellerClientFromApi = new SellerClientFromApi(config);
