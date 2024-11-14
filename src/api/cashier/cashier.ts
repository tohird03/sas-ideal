import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditCashier, ICashierAction, IGetCasheirData, IGetCashierParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class CashierApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCashier = (params: IGetCashierParams): Promise<IGetCasheirData> =>
    this.get(Endpoints.UmsCashier, {params});

  addCashier = (params: IAddEditCashier): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsCashier, params);

  editCashier = (params: IAddEditCashier): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.UmsCashier}/${params?.id}`, params);

  deleteCashier = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsCashier}/${id}`);

  cashierPaymentRequestCreateMoney = (params: ICashierAction): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsCashierAction, params);
}

export const cashierApi = new CashierApi(config);
