import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditDirectionParams, IGetDirectionData, IGetDirectionParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class DirectionApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getDirection = (params: IGetDirectionParams): Promise<IGetDirectionData> =>
    this.get(Endpoints.Direction, {params});

  addDirection = (params: IAddEditDirectionParams): Promise<AxiosResponse> =>
    this.post(Endpoints.Direction, params);

  updateDirection = (params: IAddEditDirectionParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Direction}/${params?.id}`, params);
}

export const directionApi = new DirectionApi(config);
