import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination} from '../types';
import {
  IAddApplication,
  IAddProductToCard,
  IAddResponseApplication,
  IApplicationProductParams,
  IApplicationProductResponse,
  IChangeProductMinCount,
  IEditReqProductParams,
  IGetMainStProductParams,
  IGetProductStatusData,
  IGetProductStatusParams,
  IMainStorekeeperGetCartProductData,
  IMainStorekeeperProductListData,
  IPostRequstProduct,
  IRequestList,
  IRequestsParams,
  OrderWarehouseProductParams,
  RandomPartId,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class MainStorekeeperApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getMainStProduct = (
    params: IGetMainStProductParams
  ): Promise<IMainStorekeeperProductListData> =>
    this.get(Endpoints.WmsMainStProduct, {params});

  addProductToCard = (params: IAddProductToCard): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsProductToCard, params);

  editCardProductStatus = (params: IAddProductToCard): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsProductToCard}/${params?.pmsProductId}`, params);

  editProductStatus = (params: IAddProductToCard): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsMainStProduct}/${params?.pmsProductId}`, params);

  changeProductMinCount = (
    params: IChangeProductMinCount
  ): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsProductChangeMinCount}`, params);

  getCartProduct = (
    params: IPagination
  ): Promise<IMainStorekeeperGetCartProductData> =>
    this.get(Endpoints.WmsProductToCard, {params});

  deleteProductFromCart = (cartId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.WmsProductToCard}/${cartId}`);

  createProduct = (warehouseId: string): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsMainStProduct, {warehouseId});

  getProductStatus = (
    params: IGetProductStatusParams
  ): Promise<IGetProductStatusData> =>
    this.get(Endpoints.WmsProductStatus, {params});

  getGenerationPartId = (): Promise<RandomPartId> =>
    this.get(Endpoints.WmsGetGenerationPartId);

  checkGenerationPartId = (params: RandomPartId): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsCheckGeneratePartId, params);

  getRequests = (params: IRequestsParams): Promise<IRequestList> =>
    this.get(Endpoints.WmsGetRequests, {params});

  getByIdRequest = (id: string): Promise<IAddResponseApplication> =>
    this.get(`${Endpoints.WmsGetRequests}/${id}`);

  createRequest = (params: IAddApplication): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsGetRequests, params);

  editRequst = (id: string, params: IAddApplication): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsGetRequests}/${id}`, params);

  deleteRequest = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.WmsGetRequests}/${id}`);

  getRequstProducts = (
    params: IApplicationProductParams
  ): Promise<IApplicationProductResponse> =>
    this.get(Endpoints.WmsGetRequestProducts, {params});

  postReqProducts = (params: IPostRequstProduct): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsGetRequestProducts, params);

  deleteReqProducts = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.WmsGetRequestProducts}/${id}`);

  editReqProduct = (params: IEditReqProductParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.WmsGetRequestProducts}/${params?.id}`, {
      quantity: params?.quantity,
    });

  orderWarehouseProduct = (
    params: OrderWarehouseProductParams
  ): Promise<AxiosResponse> =>
    this.post(Endpoints.WmsOrderWarehouseProduct, params);
}

export const mainStorekeeperApi = new MainStorekeeperApi(config);
