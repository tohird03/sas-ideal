import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IProductList} from '../product_list/types';
import {
  ICourierClosedFlightsInfo,
  ICourierFlightsData,
  ICourierSingleFlight,
  ICreateFlightBody,
  IGetClosedFlightData,
  IGetClosedFlightsParams,
  IGetCourierClosedFlightsInfoParams,
  IGetCourierFlightsParams,
  IGetOpenRequestData,
  IGetOpenRequestParams,
  IOpenRequest,
  IRequestProductsData,
  IRequestProductsParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.WmsBase,
  stageUrl: pmsStages.apiUrl,
};
const configDms: INetworkConfig = {
  baseURL: Endpoints.DmsBase,
  stageUrl: pmsStages.apiUrl,
};

class RequestApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getRequests = (params: IGetOpenRequestParams): Promise<IGetOpenRequestData> =>
    this.get(Endpoints.DmsRequestFromWms, {params});

  getSingleRequest = (id: string): Promise<IOpenRequest> =>
    this.get(`${Endpoints.DmsRequestFromWms}/${id}`);

  getRequestProducts = (params: IRequestProductsParams): Promise<IRequestProductsData> =>
    this.get(Endpoints.DmsRequestProducts, {params});

}

class CourierFlightsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }
  createFlight = (params: ICreateFlightBody): Promise<AxiosResponse> =>
    this.post(Endpoints.DmsCourierFlights, params);

  getCourierSingleFlightInfo = (flightId: string): Promise<ICourierSingleFlight> =>
    this.get(`${Endpoints.DmsCourierFlights}/${flightId}`);

  getCourierSingleFlightInfoProducts = (flightId: string): Promise<IProductList[]> =>
    this.get(`${Endpoints.DmsCourierFlightProducts}/${flightId}`);

  getCouriersFlights = (params: IGetCourierFlightsParams): Promise<ICourierFlightsData> =>
    this.get(Endpoints.DmsCourierFlights, {params});

  getClosedFlights = (params: IGetClosedFlightsParams): Promise<IGetClosedFlightData> =>
    this.get(Endpoints.DmsClosedFlights, {params});

  getCourierClosedFlightsInfo = (params: IGetCourierClosedFlightsInfoParams): Promise<ICourierClosedFlightsInfo> =>
    this.get(`${Endpoints.DmsClosedFlights}/${params?.flightId}`, {params: {
      startDate: params?.startDate,
      endDate: params?.endDate,
    }});
}

export const requestApi = new RequestApi(config);
export const courierFlightsApi = new CourierFlightsApi(configDms);
