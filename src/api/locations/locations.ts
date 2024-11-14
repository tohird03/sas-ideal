import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditLocation, IGetLocationsData, IGetLocationsParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.DmsBase,
  stageUrl: pmsStages.apiUrl,
};

class LocationApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getLocations = (params: IGetLocationsParams): Promise<IGetLocationsData> =>
    this.get(Endpoints.DmsLocations, {params});

  addLocation = (params: IAddEditLocation): Promise<AxiosResponse> =>
    this.post(Endpoints.DmsLocations, params);

  updateLocation = (params: IAddEditLocation): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.DmsLocations}/${params?.id}`, params);

  deleteLocation = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.DmsLocations}/${id}`);
}

export const locationApi = new LocationApi(config);
