import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddEditWarehouseTypeParams, IGetWarehouseTypeData, IGetWarehouseTypeParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class WarehouseType extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getWarehouseType = (params: IGetWarehouseTypeParams): Promise<IGetWarehouseTypeData> =>
    this.get(Endpoints.WmsWarehouseType, {params});

  addWarehouseType = (params: IAddEditWarehouseTypeParams): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsWarehouseType, params);

  updateWarehouseType = (params: IAddEditWarehouseTypeParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsWarehouseType}/${params?.id}`, params);

  deleteWarehouseType = (warehouseTypeId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.WmsWarehouseType}/${warehouseTypeId}`);
}

export const warehouseTypeApi = new WarehouseType(config);
