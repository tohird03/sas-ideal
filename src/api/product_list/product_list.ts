import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPmsAddProduct} from '../productmanager/tyes';
import {
  IBaseUpdateWorkOn,
  ICombinationWorkOn,
  IDirections,
  IPmsProductSellerPercentBulkUpdateParams,
  IProcessUpdateProcesses,
  IProductDirectionParams,
  IProductImgUploadWorkOn,
  IProductListData,
  IProductListParams,
  IProductUpdateWorkOn,
  IProductWorkOn,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: pmsStages.apiUrl,
};

class ProductApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProductList = (params: IProductListParams): Promise<IProductListData> =>
    this.get(Endpoints.PmsProductListGet, {params});

  postProductList = (params: IPmsAddProduct) =>
    this.post(Endpoints.PmsEngProductListPost, params);

  postPmsProductList = (params: IPmsAddProduct) =>
    this.post(Endpoints.PmsProductListPost, params);

  patchProductList = (params: IPmsAddProduct) =>
    this.patch(`${Endpoints.PmsProductListPatch}/${params.id}`, params);

  deleteProductList = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.PmsProductListDelete}/${id}`);

  getProductListId = (id: string): Promise<IProductWorkOn> =>
    this.get(`${Endpoints.PmsProductListGet}/${id}/work-on`);

  patchProductWorkOn = (params: IProductUpdateWorkOn) =>
    this.patch(
      `${Endpoints.PmsProductUpdateWorOn}/${params.productId}`,
      params
    );

  patchProcessWorkOn = (params: IProcessUpdateProcesses) =>
    this.patch(
      `${Endpoints.PmsProductUpdateWorOn}/${params.processId}`,
      params
    );

  patchBasesWorkOn = (params: IBaseUpdateWorkOn) =>
    this.patch(`${Endpoints.PmsProductUpdateWorOn}/${params.baseId}`, params);

  patchCombinationWorkOn = (params: ICombinationWorkOn) =>
    this.patch(
      `${Endpoints.PmsProductUpdateWorOn}/${params.combinationId}`,
      params
    );

  patchProductImgUploadWorkOn = (params: IProductImgUploadWorkOn) =>
    this.patch(`${Endpoints.PmsProductUpdateWorOn}/${params.id}`, params);

  getAllDirection = (params: IProductDirectionParams): Promise<IDirections> =>
    this.get(`${Endpoints.GetDirection}`, params);

  productsSellerPercentBulkUpdate = (params: IPmsProductSellerPercentBulkUpdateParams): Promise<AxiosResponse> =>
    this.patch(Endpoints.PmsProductsSellerPersentBulkUpdate, params);
}


export const productApi = new ProductApi(config);
