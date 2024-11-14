import {AxiosResponse} from 'axios';
import {Endpoints, smsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IPagination} from '../types';
import {
  IGetMyOrderDetailsParams,
  IGetOrderData,
  IGetOrderDetailChange,
  IGetSingleOrder,
  IOrderDetailChangeParams,
  IOrderParams,
  IOrderUpdateParams,
  ISellerPrePaymentToOrder,
  ISingleOrderDetailChange,
  IUpdateOrderDetailChange,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.SmsBase,
  stageUrl: smsStages.apiUrl,
};

class OrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getAllOrders = (params: IOrderParams): Promise<IGetOrderData> =>
    this.get(Endpoints.SmsOrder, {params});

  getSellerOrders = (params: IOrderParams): Promise<IGetOrderData> =>
    this.get(Endpoints.SmsSellerOrder, {params});

  getSingleOrder = (orderId: string): Promise<IGetSingleOrder> =>
    this.get(`${Endpoints.SmsOrder}/${orderId}`);

  updateOrder = (params: IOrderUpdateParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SmsOrder}/${params?.orderId}`, params);

  addPrePaymentsToOrder = (params: ISellerPrePaymentToOrder): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsPrePaymentToOrder, params);

  getMyOrderDetails = (params: IGetMyOrderDetailsParams): Promise<any> =>
    this.get(Endpoints.SmsMyOrderDetails, {params});

  deleteMyOrder = (orderId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SmsOrder}/${orderId}`);

  deleteMyOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.patch(Endpoints.SmsOrderDetailsCancel, {id: productId});

  getOrderDetailChange = (params: IPagination): Promise<IGetOrderDetailChange> =>
    this.get(Endpoints.SmsOrderDetailChange, {params});

  getSingleOrderDetailChange = (orderDetailId: string): Promise<ISingleOrderDetailChange> =>
    this.get(`${Endpoints.SmsOrderDetailChange}/${orderDetailId}`);

  orderDetailChange = (params: IOrderDetailChangeParams): Promise<AxiosResponse> =>
    this.post(Endpoints.SmsOrderDetailChange, params);

  updateOrderDetailChange = (params: IUpdateOrderDetailChange): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SmsOrderDetailChange}/${params?.orderDetailId}`, {
      type: params?.type,
      status: params?.status,
    });
}

export const ordersApi = new OrdersApi(config);
