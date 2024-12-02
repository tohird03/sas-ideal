import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IResponse} from '../types';
import { IGetProductsParams, IProducts } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProducts = (params: IGetProductsParams): Promise<IResponse<IProducts[]>> =>
    this.get(Endpoints.products, {params});

  // addNewStaff = (params: IAddOrEditStaff): Promise<AxiosResponse> =>
  //   this.post(Endpoints.Staffs, params);

  // updateStaff = (params: IAddOrEditStaff): Promise<AxiosResponse> =>
  //   this.patch(`${Endpoints.Staffs}/${params?.id}`, params);

  deleteProduct = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.products}/${id}`);
}

export const productsApi = new ProductsApi(config);
