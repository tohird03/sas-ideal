import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IGetTissueColorData, IGetTissueColorParams, IGetTissueData, IGetTissueParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class TissueApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getTissue = (params: IGetTissueParams): Promise<IGetTissueData> =>
    this.get(Endpoints.PmsTissue, {params});

  getTissueColor = (params: IGetTissueColorParams): Promise<IGetTissueColorData> =>
    this.get(Endpoints.PmsColorByTissue, {params});
}

export const tissueApi = new TissueApi(config);
