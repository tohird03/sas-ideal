import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination} from '../types';
import {IGetPaymentData, IPaymentCreate} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class PaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPayments = (params: IPagination): Promise<IGetPaymentData> =>
    this.get(Endpoints.UmsPayment, {params});

  addPayment = (params: IPaymentCreate): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsPayment, params);

  // addPaymentType = (params: IAddEditPaymentType): Promise<AxiosResponse> =>
  //   this.post(Endpoints.UmsPaymentType, params);

  // updatePaymentType = (params: IAddEditPaymentType): Promise<AxiosResponse> =>
  //   this.patch(`${Endpoints.UmsPaymentType}/${params?.id}`, params);

  // deletePaymentType = (id: string): Promise<AxiosResponse> =>
  //   this.delete(`${Endpoints.UmsPaymentType}/${id}`);

}

export const paymentApi = new PaymentApi(config);
