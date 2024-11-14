import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IGetWarehouseData,
  IGetWarehouseParams,
  IGetWarehouseTypeData,
  IGetWarehouseTypeParams,
  IGetWarehouseUserData,
  IGetWarehouseUserParams,
  IWarehouseAddEdit,
  IWarehouses,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class WmsWarehouseApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllWarehouses = (): Promise<IGetWarehouseData> =>
    this.get(Endpoints.WmsWarehouses);

  getWarehouses = (params: IGetWarehouseParams): Promise<IGetWarehouseData> =>
    this.get(Endpoints.WmsWarehouses, {params});

  getSingleWarehouse = (warehouseId: string): Promise<IWarehouses> =>
    this.get(`${Endpoints.WmsWarehouses}/${warehouseId}`);

  addNewWarehouse = (params: IWarehouseAddEdit): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsWarehouses, params);

  editWarehouse = (params: IWarehouseAddEdit): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsWarehouses}/${params?.warehouseId}`, params);

  deleteWarehouse = (warehouseId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.WmsWarehouses}/${warehouseId}`);

  getWarehouseTypes = (params: IGetWarehouseTypeParams): Promise<IGetWarehouseTypeData> =>
    this.get(Endpoints.WmsWarehouseType, {params});

  getWarehouseUsers = (params: IGetWarehouseUserParams): Promise<IGetWarehouseUserData> =>
    this.get(Endpoints.WmsWarehouseUser, {params});
}

export const wmsWarehouseApi = new WmsWarehouseApi(config);
