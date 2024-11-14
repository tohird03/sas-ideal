import {Dayjs} from 'dayjs';
import {CourierTgStatus} from '../courier/types';
import {IProductList} from '../product_list/types';
import {IPagination} from '../types';

export interface IGetOpenRequestParams extends IPagination {
  flag?: string;
  client?: string;
  deliveryDate?: string;
  createdAt?: string;
  status?: string;
  requestId?: string;
  productId?: string;
}

export interface IGetOpenRequestData {
  requestsList: IOpenRequest[];
  count: number;
}

export interface IOpenRequest {
  id: string;
  requestId: number;
  clientName: string;
  clientPhone: string;
  from: {
    id: string;
    name: string;
  };
  to: string;
  status: string;
  deliveryDate: string;
  createdAt: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  };
  deliveryId?: string;
}

export interface IGetCourierFlightsParams extends IPagination {
  requestId?: string;
  productId?: string;
  status?: string;
  warehouseId?: string;
  client?: string;
  flag?: string;
}

export interface ICourierFlightsData {
  deliveryList: ICourierFlights[];
  count: number;
}

export interface ICourierFlights {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  createdAt: string;
  avatar: string;
  tgStatus: CourierTgStatus;
  userId: string;
  deliveries: ICourierFlightsDeliverier[];
}

export interface ICourierSingleFlight extends ICourierFlightsDeliverier {
  request: IOpenRequest;
}

export interface ICourierFlightsDeliverier {
  id: string;
  requestId: string;
  deliveryTime: string;
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  promotion: number;
  status: string;
  deliveryId: string;
}

export interface IRequestProductsParams extends IPagination {
  requestId: string;
}

export interface IRequestProductsData {
  count: number;
  requestsProductList: IProductList[];
}

export interface IGetClosedFlightsParams extends IPagination {
  phone?: string;
  name?: string;
  startDate: Date;
  endDate: Date;
}

export interface IGetClosedFlightData {
  data: IClosedFlights[];
  count: number;
}

export interface IFlightsCourierInfo {
  id: string;
  avatar: string;
  name: string;
  phone: string;
}

export interface IClosedFlights {
  id: string;
  startDate: string;
  endDate: string;
  promotion: number;
  deliveryCount: number;
  courierInfo: IFlightsCourierInfo;
}

export interface IGetCourierClosedFlightsInfoParams {
  flightId: string;
  startDate: Date;
  endDate: Date;
}

export interface ICourierClosedFlightsInfo {
  id: string;
  courierInfo: IFlightsCourierInfo;
  deliveries: ICourierClosedFlightsDeliveries[];
}

export interface ICourierClosedFlightsDeliveries {
  id: string;
  deliveryTime: string;
  deliveryId: number;
  to: string;
  from: string;
  promotion: number;
  request: {
    id: string;
    from: string;
    to: string;
    status: string;
    clientName: string;
    clientPhone: string;
    requesterName: string;
    requesterPhone: string;
    deliveryDate: string;
    requestId: number;
  };
  products?: IProductList[];
}

export interface ICreateFlightProducts {
  productId: string;
  count: number;
}

export interface ICreateFlightBody {
  requestId: string;
  courierId: string;
  to: string;
  from: string;
  status: string;
  deliveryTime: Dayjs;
  promotion: string;
  products: ICreateFlightProducts[];
}
