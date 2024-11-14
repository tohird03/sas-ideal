import {makeAutoObservable} from 'mobx';
import {courierFlightsApi} from '@/api/dmsRequest';
import {
  IClosedFlights,
  ICourierFlights,
  ICreateFlightBody,
  ICreateFlightProducts,
  IGetClosedFlightsParams,
} from '@/api/dmsRequest/types';
import {IProductList} from '@/api/product_list/types';
import {addNotification} from '@/utils';

class RequestStore {
  #today = new Date();
  #lastMonth = new Date();

  requestId: string | null = null;
  requestPageNumber = 1;
  requestPageSize = 10;
  requestProductPageNumber = 1;
  requestProductPageSize = 10;
  isOpenRequestInfoModal = false;

  requestAndFlightClientSearch: string | null = null;
  requestAndFlightRequestrSearch: string | null = null;
  requestAndFlightRequestIdSearch: string | null = null;
  requestAndFlightProductIdSearch: string | null = null;

  flightId: string | null = null;
  singleFlightCourier: ICourierFlights | null = null;
  isOpenFlightInfoModal = false;
  courierFlightPageNumber = 1;
  courierFlightPageSize = 10;
  createFlightBody: ICreateFlightBody | null = null;
  isOpenAddFlightRequestModal = false;

  closedFlightPageNumber = 1;
  closedFlightPageSize = 10;
  closedFlightNameSearch: string | null = null;
  closedFlightPhoneSearch: string | null = null;
  closedFlightStartDate: Date = this.#lastMonth;
  closedFlightEndDate: Date = this.#today;
  isOpenClosedFlightInfoModal = false;
  singleClosedFlight: IClosedFlights | null = null;

  createFlightProductPageNumber = 1;
  createFlightProductPageSize = 10;
  createFlightProducts: ICreateFlightProducts[] = [];
  isOpenProductSplitModal = false;
  singleCreateFlightProduct: IProductList | null = null;

  constructor() {
    makeAutoObservable(this);
    this.#lastMonth.setMonth(this.#lastMonth.getMonth() - 1);
  }

  getClosedFlights = (params: IGetClosedFlightsParams) =>
    courierFlightsApi.getClosedFlights(params)
      .then(res => res)
      .catch(addNotification);

  setIsOpenProductSplitModal = (isOpen: boolean) => {
    this.isOpenProductSplitModal = isOpen;
  };

  setSingleCreateFlightProduct = (singleCreateFlightProduct: IProductList | null) => {
    this.singleCreateFlightProduct = singleCreateFlightProduct;
  };

  setIsOpenRequestInfoModal = (isOpen: boolean) => {
    this.isOpenRequestInfoModal = isOpen;
  };

  setRequestId = (id: string | null) => {
    this.requestId = id;
  };

  setRequestPageNumber = (pageNumber: number) => {
    this.requestPageNumber = pageNumber;
  };

  setRequestPageSize = (pageSize: number) => {
    this.requestPageSize = pageSize;
  };

  setRequestAndFlightClientSearch = (clientSearch: string | null) => {
    this.requestAndFlightClientSearch = clientSearch;
  };

  setRequestAndFlightRequestrSearch = (requestAndFlightRequestrSearch: string | null) => {
    this.requestAndFlightRequestrSearch = requestAndFlightRequestrSearch;
  };

  setRequestAndFlightRequestIdSearch = (requestAndFlightRequestIdSearch: string | null) => {
    this.requestAndFlightRequestIdSearch = requestAndFlightRequestIdSearch;
  };

  setRequestAndFlightProductIdSearch = (requestAndFlightProductIdSearch: string | null) => {
    this.requestAndFlightProductIdSearch = requestAndFlightProductIdSearch;
  };

  setRequestProductPageNumber = (pageNumber: number) => {
    this.requestProductPageNumber = pageNumber;
  };

  setRequestProductPageSize = (pageSize: number) => {
    this.requestProductPageSize = pageSize;
  };

  setFlightId = (id: string | null) => {
    this.flightId = id;
  };

  setSingleFlightCourier = (courier: ICourierFlights | null) => {
    this.singleFlightCourier = courier;
  };

  setIsOpenFlightInfoModal = (isOpen: boolean) => {
    this.isOpenFlightInfoModal = isOpen;
  };

  setCourierFlightPageNumber = (courierFlightPageNumber: number) => {
    this.courierFlightPageNumber = courierFlightPageNumber;
  };

  setCourierFlightPageSize = (courierFlightPageSize: number) => {
    this.courierFlightPageSize = courierFlightPageSize;
  };

  setCreateFlightBody = (createFlightBody: ICreateFlightBody | null) => {
    this.createFlightBody = createFlightBody;
  };

  setIsOpenAddFlightRequestModal = (isOpenAddFlightRequestModal: boolean) => {
    this.isOpenAddFlightRequestModal = isOpenAddFlightRequestModal;
  };

  setClosedFlightPageNumber = (pageNumber: number) => {
    this.closedFlightPageNumber= pageNumber;
  };

  setClosedPageSize = (pageSize: number) => {
    this.closedFlightPageSize = pageSize;
  };

  setClosedFlightNameSearch = (closedFlightNameSearch: string | null) => {
    this.closedFlightNameSearch = closedFlightNameSearch;
  };

  setClosedFlightPhoneSearch = (closedFlightPhoneSearch: string | null) => {
    this.closedFlightPhoneSearch = closedFlightPhoneSearch;
  };

  setClosedFlightStartDate = (closedFlightStartDate: Date) => {
    this.closedFlightStartDate = closedFlightStartDate;
  };

  setClosedFlightEndDate = (closedFlightEndDate: Date) => {
    this.closedFlightEndDate = closedFlightEndDate;
  };

  setIsOpenClosedFlightInfoModal = (isOpen: boolean) => {
    this.isOpenClosedFlightInfoModal = isOpen;
  };

  setSingleClosedFlight = (singleClosed: IClosedFlights | null) => {
    this.singleClosedFlight = singleClosed;
  };

  setCreateFlightProductPageNumber = (createFlightProductPageNumber: number) => {
    this.createFlightProductPageNumber = createFlightProductPageNumber;
  };

  setCreateFlightProductPageSize = (createFlightProductPageSize: number) => {
    this.createFlightProductPageSize = createFlightProductPageSize;
  };

  setCreateFlightProducts = (createFlightProducts: ICreateFlightProducts[]) => {
    this.createFlightProducts = createFlightProducts;
  };

  reset() {
    this.isOpenProductSplitModal = false;
  }
}

export const requestStore = new RequestStore();
