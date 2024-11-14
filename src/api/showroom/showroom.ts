import {AxiosResponse} from 'axios';
import {Endpoints, smsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IUserData} from '../users/types';
import {IAddNewShowroom, IGetShowroomUsers, IShowroom} from './types';


const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class ShowroomApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllShowroom = (): Promise<IShowroom[]> =>
    this.get(Endpoints.AllShowroom);

  addNewShowroom = (params: IAddNewShowroom): Promise<AxiosResponse> =>
    this.post(Endpoints.Showroom, params);

  updateShowroom = (params: IAddNewShowroom): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Showroom}/${params?.showroomId}`, params);

  deleteShowroom = (showroomId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Showroom}/${showroomId}`);

  getShowroomUsers = (params: IGetShowroomUsers): Promise<IUserData> =>
    this.get(Endpoints.GetShowroomUsers, {params});

}

export const showroomApi = new ShowroomApi(config);
