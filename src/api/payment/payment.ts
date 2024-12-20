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

  // getSupplierInfo = (params: IGetSupplierInfoParams): Promise<IResponse<ISupplierInfo[]>> =>
  //   this.get(Endpoints.Supplier, { params });

  // addSupplier = (params: IAddSupplierInfo): Promise<AxiosResponse> =>
  //   this.post(Endpoints.Supplier, params);

  // // UPDATE
  // updateUser = (params: IUpdateUser): Promise<AxiosResponse> =>
  //   this.patch(`${Endpoints.Users}/${params?.id}`, params);

  // deleteUser = (id: string): Promise<AxiosResponse> =>
  //   this.delete(`${Endpoints.Users}/${id}`);
}

export const paymentApi = new PaymentApi(config);
