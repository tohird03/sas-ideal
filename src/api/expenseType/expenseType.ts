import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditExpenseTypeParams, IGetExpenseTypeData, IGetExpenseTypeParams} from './type';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class ExpenseTypeApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getExpenseType = (params: IGetExpenseTypeParams): Promise<IGetExpenseTypeData> =>
    this.get(Endpoints.PmsExpenseType, {params});

  addExpenseType = (params: IAddEditExpenseTypeParams): Promise<AxiosResponse> =>
    this.post(Endpoints.PmsExpenseType, params);

  updateExpenseType = (params: IAddEditExpenseTypeParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsExpenseType}/${params?.id}`, params);

  deleteExpenseType = (warehouseTypeId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsExpenseType}/${warehouseTypeId}`);
}

export const expenseTypeApi = new ExpenseTypeApi(config);
