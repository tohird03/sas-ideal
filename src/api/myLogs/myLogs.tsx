import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IGetMyLogs, IMyLogId, IMyLogsParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class MyTasksApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getTasks = (params: IMyLogsParams): Promise<IGetMyLogs> =>
    this.get(Endpoints.MyTasks, {params});

  deleteTask = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsDeleteTask}/${id}`);

  getTaskId = (id: string): Promise<AxiosResponse> =>
    this.get(`${Endpoints.PmsGetTaskId}/${id}`);
}

export const myTasksApi = new MyTasksApi(config);
