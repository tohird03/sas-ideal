import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {ICombinationParams, IGetCombination} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: pmsStages.apiUrl,
};

class CombinationApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCombination = (params: ICombinationParams): Promise<IGetCombination> =>
    this.get(Endpoints.PmsCombinationGet, {params});
}


export const combinationApi = new CombinationApi(config);
