import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditCashbox, IGetCashboxData, IGetCashboxParams, ITransferMoneyFromCashboxParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class CashboxApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCashbox = (params: IGetCashboxParams): Promise<IGetCashboxData> =>
    this.get(Endpoints.UmsCashbox, {params});

  addCashbox = (params: IAddEditCashbox): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsCashbox, params);

  updateCashbox = (params: IAddEditCashbox): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.UmsCashbox}/${params?.id}`, params);

  deleteCashbox = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.UmsCashbox}/${id}`);

  transferMoney = (params: ITransferMoneyFromCashboxParams): Promise<AxiosResponse> =>
    this.post(Endpoints.UmsTransferMoneyFromCashbox, params);
}

export const cashboxApi = new CashboxApi(config);
