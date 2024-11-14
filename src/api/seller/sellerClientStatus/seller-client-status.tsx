import {AxiosResponse} from 'axios';
import {Endpoints, smsStages} from '../../endpoints';
import {INetworkConfig, Instance} from '../../instance';
import {IAddEditClientStatus, IClientStatus, IGetClientStatusParams} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class SellerClientStatusApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClintsStatus = (params: IGetClientStatusParams): Promise<IClientStatus[]> =>
    this.get(Endpoints.SmsClientStatus, {params});

  addClientStatus = (params: IAddEditClientStatus): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsClientStatus, params);

  updateClientStatus = (params: IAddEditClientStatus): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SmsClientStatus}/${params?.id}`, params);

}

export const sellerClientStatusApi = new SellerClientStatusApi(config);
