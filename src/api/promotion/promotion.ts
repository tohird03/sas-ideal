import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IAddEditPromotion,
  IAddEditPromotionProduct,
  IGetPromotionData,
  IGetPromotionParams,
  IGetPromotionProductData,
  IPromotion,
  IPromotionProductListParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class PromotionApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getPromotion = (params: IGetPromotionParams): Promise<IGetPromotionData> =>
    this.get(Endpoints.PmsPromotion, {params});

  getSinglePromotion = (id: string): Promise<IPromotion> =>
    this.get(`${Endpoints.PmsPromotion}/${id}`);

  addPromotion = (params: IAddEditPromotion): Promise<AxiosResponse> =>
    this.post(Endpoints.PmsPromotion, params);

  editPromotion = (params: IAddEditPromotion): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsPromotion}/${params?.id}`, params);

  stopPromotion = (id: string): Promise<AxiosResponse> =>
    this.put(`${Endpoints.PmsPromotion}/${id}`);

  getPromotionProducts = (params: IPromotionProductListParams): Promise<IGetPromotionProductData> =>
    this.get(Endpoints.PmsPromotionProducts, {params});

  addPromotionProducts = (params: IAddEditPromotionProduct): Promise<AxiosResponse> =>
    this.post(Endpoints.PmsPromotionProducts, params);

  updatePromotionProducts = (params: IAddEditPromotionProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.PmsPromotionProducts}/${params?.promotionId}`, params);

}

export const promotionApi = new PromotionApi(config);
