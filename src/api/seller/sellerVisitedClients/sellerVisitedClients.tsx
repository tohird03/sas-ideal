import {AxiosResponse} from 'axios';
import {Endpoints, smsStages} from '../../endpoints';
import {INetworkConfig, Instance} from '../../instance';
import {IAddVisitedClient, IGetClientsData, IGetClientsParams, IGetVisitedClients, IGetVisitedClientsParams} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class SellerVisitedClientsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAboutVisitedClients = (params: IGetVisitedClientsParams): Promise<IGetVisitedClients> =>
    this.get(Endpoints.SmsAboutVisitedClients, {params});

  getClients = (params: IGetClientsParams): Promise<IGetClientsData> =>
    this.get(Endpoints.SmsClients, {params});

  addVisitedClient = (params: IAddVisitedClient): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsAboutVisitedClients, params);
}

export const sellerVisitedClientsApi = new SellerVisitedClientsApi(config);
