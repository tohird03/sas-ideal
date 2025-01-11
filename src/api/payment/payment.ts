import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditPaymentParams, IClientsPayments, IGetClientsPaymentsParams } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class PaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPayments = (params: IGetClientsPaymentsParams): Promise<IResponse<IClientsPayments[]>> =>
    this.get(Endpoints.payment, { params });

  addPayment = (params: IAddEditPaymentParams): Promise<AxiosResponse> =>
    this.post(Endpoints.payment, params);

  updatePayment = (params: IAddEditPaymentParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.payment}/${params?.id}`, params);

  deletePayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.payment}/${id}`);
}

export const paymentApi = new PaymentApi(config);
