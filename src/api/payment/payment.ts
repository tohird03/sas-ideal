import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddPaymentParams } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class PaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  // getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
  //   this.get(Endpoints.Clients, { params });

  addPayment = (params: IAddPaymentParams): Promise<AxiosResponse> =>
    this.post(Endpoints.payment, params);

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
