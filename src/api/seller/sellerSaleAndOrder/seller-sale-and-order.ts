import {AxiosResponse, AxiosStatic} from 'axios';
import {Endpoints, smsStages} from '../../endpoints';
import {INetworkConfig, Instance} from '../../instance';
import {
  IGetSellerBasketProductsParams,
  ISaleProducts,
  ISellerAddProductToBasketParams,
  ISellerBasketProducts,
  IUpdateBasketProduct,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class SellerSaleAndOrderApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getBasketProducts = (params: IGetSellerBasketProductsParams): Promise<ISellerBasketProducts[]> =>
    this.get(Endpoints.SmsBasketProducts, {params});

  deleteBasketProducts = (productId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SmsBasketProducts}/${productId}`);

  addProductToBasket = (params: ISellerAddProductToBasketParams): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsAddProductToBasket, params);

  updateBasketProduct = (params: IUpdateBasketProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SmsBasketProducts}/${params?.productId}`, {
      quantity: params?.quantity,
      fixForSeller: params?.fixForSeller,
    });

  saleProducts = (params: ISaleProducts): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsSaleProducts, params);

  deleteMyOrder = (orderId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SmsOrder}/${orderId}`);

  deleteMyOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.patch(Endpoints.SmsOrderDetailsCancel, {id: productId});
}

export const sellerSaleAndOrderApi = new SellerSaleAndOrderApi(config);
