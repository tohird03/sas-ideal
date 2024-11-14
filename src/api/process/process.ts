import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination} from '../types';
import {IAddProcess, IGetProcess, IGetProcessUnit} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class ProcessApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProcess = (params: IPagination): Promise<IGetProcess> =>
    this.get(Endpoints.Process, {params});

  addProcess = (params: IAddProcess): Promise<AxiosResponse> =>
    this.post(Endpoints.Process, params);

  updateProcess = (params: IAddProcess): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Process}/${params?.id}`, params);

  getProcessUnit = (): Promise<IGetProcessUnit> =>
    this.get(Endpoints.Unit, {
      pageSize: 1000,
      pageNumber: 1,
    });

  deleteProcess = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Process}/${id}`);
}

export const processApi = new ProcessApi(config);
