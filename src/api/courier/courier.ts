import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddUser, IUser} from '../users/types';
import {ICourier, ICourierChangeTgStatus, IGetCourierData, IGetCourierParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.DmsBase,
  stageUrl: pmsStages.apiUrl,
};

class CourierApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCouriers = (params: IGetCourierParams): Promise<IGetCourierData> =>
    this.get(Endpoints.DmsCouriers, {params});

  getSingleCouriers = (courierId: string): Promise<ICourier> =>
    this.get(`${Endpoints.DmsCouriers}/${courierId}`);

  addUserCourier = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.post(Endpoints.DmsCouriers, params);

  editCourier = (params: IAddUser): Promise<AxiosResponse<IUser | null>> =>
    this.patch(`${Endpoints.DmsCouriers}/${params?.id}`, params);

  editCourierTgStatus = (params: ICourierChangeTgStatus): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.DmsCouriers}/${params?.userId}`, params);

  deletCourier = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.DmsCouriers}/${id}`);
}

export const courierApi = new CourierApi(config);
