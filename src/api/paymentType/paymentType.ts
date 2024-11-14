import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditPaymentType, IGetPaymentTypeData, IGetPaymentTypeParams, IPaymentType} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class PaymentTypeApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPaymentType = (params: IGetPaymentTypeParams): Promise<IGetPaymentTypeData> =>
    this.get(Endpoints.UmsPaymentType, {params});

  getFullPaymentType = (): Promise<IPaymentType[]> =>
    this.get(Endpoints.UmsPaymentTypeFull);

  addPaymentType = (params: IAddEditPaymentType): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsPaymentType, params);

  updatePaymentType = (params: IAddEditPaymentType): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.UmsPaymentType}/${params?.id}`, params);

  deletePaymentType = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsPaymentType}/${id}`);

}

export const paymentTypeApi = new PaymentTypeApi(config);
