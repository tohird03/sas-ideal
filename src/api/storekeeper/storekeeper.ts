import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IOneElement} from '../types';
import {
  IAddProductBasketType,
  IAddProductFromRequest,
  IEditProductStatusQty,
  IGetCategoryListResponse,
  IGetCategoryParams,
  IGetDirectionListResponse,
  IGetModelListResponse,
  IGetModelParams,
  IGetProductStatusListResponse,
  IGetRequestToWarehouseData,
  IGetRequestToWarehouseProducts,
  IGetRequestToWarehouseProductsData,
  IOneParams,
  IStorekeeperCartAllProducts,
  IStorekeeperFilterParams,
  IStorekeeperRequestFilter,
  StorekeeperAllProductList,
  StorekeeperProductList,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};

class StorekeeperApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllProducts = (
    params: IStorekeeperFilterParams
  ): Promise<StorekeeperProductList> =>
    this.get(Endpoints.WmsStorekeeperProductsGet, {params});

  getProducts = (
    params: IStorekeeperFilterParams
  ): Promise<StorekeeperAllProductList> =>
    this.get(Endpoints.PmsStorekeeperProductsGet, {params});

  getAllWarehouses = (): Promise<IOneElement[]> =>
    this.get(Endpoints.WmsAllWarehousesGet);

  getPmsCategory = (
    params: IGetCategoryParams
  ): Promise<IGetCategoryListResponse> =>
    this.get(Endpoints.PmsCategoryGet, {params});

  getDirections = (params: IOneParams): Promise<IGetDirectionListResponse> =>
    this.get(Endpoints.PmsDirectionGet, {params});

  getModel = (params: IGetModelParams): Promise<IGetModelListResponse> =>
    this.get(Endpoints.PmsModelGet, {params});

  getProductStatus = (
    params: IGetModelParams
  ): Promise<IGetProductStatusListResponse> =>
    this.get(Endpoints.WmsProductStatusGet, {params});

  editProductStatusQty = (id: string, params: IEditProductStatusQty) =>
    this.patch(`${Endpoints.WmsEditProductStatusQty}/${id}`, params);

  addPoductBaket = (params: IAddProductBasketType) =>
    this.post(Endpoints.WmsAddProductCart, params);

  getProductsCart = (
    params: IOneParams
  ): Promise<IStorekeeperCartAllProducts> =>
    this.get(Endpoints.WmsAddProductCart, {params});

  deleteProductCart = (id: string) =>
    this.delete(`${Endpoints.WmsAddProductCart}/${id}`);

  editCartProductStatusQty = (id: string, params: IEditProductStatusQty) =>
    this.patch(`${Endpoints.WmsAddProductCart}/${id}`, params);

  submitProducts = () => this.post(Endpoints.WmsSubmitProducts);

  getRequestToWarehouse = (params: IStorekeeperRequestFilter): Promise<IGetRequestToWarehouseData> =>
    this.get(Endpoints.WmsRequestsToWarehouse, {params});

  getSingleRequestProducts = (params: IGetRequestToWarehouseProducts): Promise<IGetRequestToWarehouseProductsData> =>
    this.get(Endpoints.WmsRequestToWarehouseProducts, {params});

  createProduct = (params: IAddProductFromRequest) =>
    this.post(Endpoints.WmsSubmitProducts, params);
}


export const storekeeperApi = new StorekeeperApi(config);
