import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination, IResponse} from '../types';
import { IAddOrEditStaff, IGetStaffsParams, IStaffs } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class StaffsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getStaffs = (params: IGetStaffsParams): Promise<IResponse<IStaffs[]>> =>
    this.get(Endpoints.Staffs, {params});

  addNewStaff = (params: IAddOrEditStaff): Promise<AxiosResponse> =>
    this.post(Endpoints.Staffs, params);

  updateStaff = (params: IAddOrEditStaff): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Staffs}/${params?.id}`, params);

  deleteStaff = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Staffs}/${id}`);
}

export const staffsApi = new StaffsApi(config);
