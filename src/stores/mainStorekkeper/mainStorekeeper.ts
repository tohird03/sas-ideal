import {makeAutoObservable} from 'mobx';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {
  ApplicationsFilterParams,
  IAddApplication,
  IAddResponseApplication,
  IEditReqProductParams,
  IGetProductStatusParams,
  IMainStorekeeperProductList,
  IPostRequstProduct,
  IUpdateStorekeeperWarehouse,
  OrderWarehouseProductParams,
} from '@/api/mainStorekeeper/types';
import {IProductList} from '@/api/product_list/types';
import {IPagination} from '@/api/types';
import {IAddUser, IUser} from '@/api/users/types';
import {addNotification} from '@/utils';

class MainStorekeeperStore {
  isOpenAddNewWarehouseModal = false;
  isOpenAddStorekeeperModal = false;
  updateSingleWarehouse: IUpdateStorekeeperWarehouse | null = null;
  isOpenUploadProductModal = false;
  isOpenChangeStatusModal = false;
  singleProduct: IMainStorekeeperProductList | null = null;
  singleCreateProduct: IProductList | null = null;
  isOpenChangeStatusCreateProduct = false;
  singleCartProduct: IProductList | null = null;
  isOpenChangeStatusCartProduct = false;
  isOpenCartChooseWarehouseModal = false;
  isOpneAddApplicationModal = false;
  isOpenAddProductApplicationModal = false;

  pageNumber = 1;
  pageSize = 10;
  filterProductName: string | null = null;
  filterProductModelName: string | null = null;
  filterCategory: string | null = null;
  filterModel: string | null = null;
  filterTissue: string | null = null;
  filterTissueColor: string | null = null;
  filterWarehouse: string | null = null;
  filterDetails: string | null = 'details';
  filterDirection: string | null = null;

  filterCreateProductProductName: string | null = null;
  filterCreateProductProductModelName: string | null = null;
  filterCreateProductCategory: string | null = null;
  filterCreateProductModel: string | null = null;
  filterCreateProductTissue: string | null = null;
  filterCreateProductTissueColor: string | null = null;
  filterCreateProductWarehouse: string | null = null;
  filterCreateProductProvider: string | null = null;
  filterCreateProductDirection: string | null = null;
  createProductPageNumber = 1;
  createProductPageSize = 10;

  cartProductPageNumber = 1;
  cartProductPageSize = 10;

  applicationsPageNumber = 1;
  applicationsPageSize = 10;

  singleStorekeeper: IAddUser | null = null;

  isHaveOldUser: IUser | null = null;
  isOpenHaveOldUserError = false;

  filterApplicationsParams: ApplicationsFilterParams | null = null;
  localApplication: IAddResponseApplication | null = null;
  edtiLocalApplication: IAddApplication | null = null;

  applicationProductSearch = '';
  applicationProductsPageNumber = 1;
  applicationProductsPageSize = 10;

  localReqProducts: IMainStorekeeperProductList[] = [];
  isOpenEditReqProductModal = false;
  reqProductQty: IEditReqProductParams = {id: '', quantity: 0};

  isOpenOrderProductModal = false;
  warehouseOrderProduct: IMainStorekeeperProductList | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getCartProduct = (params: IPagination) =>
    mainStorekeeperApi
      .getCartProduct(params)
      .then((res) => res)
      .catch(addNotification);

  getProductStatus = (params: IGetProductStatusParams) =>
    mainStorekeeperApi
      .getProductStatus(params)
      .then((res) => res)
      .catch(addNotification);

  postApplications = (params: IAddApplication) =>
    mainStorekeeperApi
      .createRequest(params)
      .then((res) => res?.data)
      .catch(addNotification);

  editApplication = (id: string, params: IAddApplication) =>
    mainStorekeeperApi
      .editRequst(id, params)
      .then((res) => res)
      .catch(addNotification);

  deleteApplication = (id: string) =>
    mainStorekeeperApi
      .deleteRequest(id)
      .then((res) => res)
      .catch(addNotification);

  postReqProducts = (params: IPostRequstProduct) =>
    mainStorekeeperApi
      .postReqProducts(params)
      .then((res) => res)
      .catch(addNotification);

  deleteReqProduct = (id: string) =>
    mainStorekeeperApi
      .deleteReqProducts(id)
      .then((res) => res)
      .catch(addNotification);

  editReqProduct = (params: IEditReqProductParams) =>
    mainStorekeeperApi
      .editReqProduct(params)
      .then((res) => res)
      .catch(addNotification);

  postOrderWarehouseProduct = (params: OrderWarehouseProductParams) =>
    mainStorekeeperApi.orderWarehouseProduct(params)
      .then((res) => res)
      .catch(addNotification);

  setIsOpenAddNewWarehouseModal = (isOpen: boolean) => {
    this.isOpenAddNewWarehouseModal = isOpen;
  };

  setIsOpenAddStorekepeerModal = (isOpen: boolean) => {
    this.isOpenAddStorekeeperModal = isOpen;
  };

  setUpdateWarehouse = (
    singleWarehouse: IUpdateStorekeeperWarehouse | null
  ) => {
    this.updateSingleWarehouse = singleWarehouse;
  };

  setIsOpenUploadProductModal = (isOpen: boolean) => {
    this.isOpenUploadProductModal = isOpen;
  };

  setIsOpenChangeStatusModal = (isOpen: boolean) => {
    this.isOpenChangeStatusModal = isOpen;
  };

  setSingleProduct = (singleProduct: IMainStorekeeperProductList | null) => {
    this.singleProduct = singleProduct;
  };

  setSingleCreateProduct = (singleCreateProduct: IProductList | null) => {
    this.singleCreateProduct = singleCreateProduct;
  };

  setIsOpenChangeStatusCreateProduct = (
    isOpenChangeStatusCreateProduct: boolean
  ) => {
    this.isOpenChangeStatusCreateProduct = isOpenChangeStatusCreateProduct;
  };

  setSingleCartProduct = (singleCartProduct: IProductList | null) => {
    this.singleCartProduct = singleCartProduct;
  };

  setIsOpenChangeStatusCartProduct = (
    isOpenChangeStatusCartProduct: boolean
  ) => {
    this.isOpenChangeStatusCartProduct = isOpenChangeStatusCartProduct;
  };

  setIsOpenCartChooseWarehouseModal = (
    isOpenCartChooseWarehouseModal: boolean
  ) => {
    this.isOpenCartChooseWarehouseModal = isOpenCartChooseWarehouseModal;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setFilterProductName = (filterProductName: string | null) => {
    this.filterProductName = filterProductName;
  };

  setFilterProductModelName = (filterProductModelName: string | null) => {
    this.filterProductModelName = filterProductModelName;
  };

  setFilterCreateProductProvider = (
    filterProductProviderName: string | null
  ) => {
    this.filterCreateProductProvider = filterProductProviderName;
  };

  setFilterCreateProductDirection = (filterProductDirection: string | null) => {
    this.filterCreateProductDirection = filterProductDirection;
  };

  setFilterCategory = (filterCategory: string | null) => {
    this.filterCategory = filterCategory;
  };

  setFilterModel = (filterModel: string | null) => {
    this.filterModel = filterModel;
  };

  setFilterTissue = (filterTissue: string | null) => {
    this.filterTissue = filterTissue;
  };

  setFilterTissueColor = (filterTissueColor: string | null) => {
    this.filterTissueColor = filterTissueColor;
  };

  setFilterWarehouse = (filterWarehouse: string | null) => {
    this.filterWarehouse = filterWarehouse;
  };

  setFilterDetails = (filterDetails: string | null) => {
    this.filterDetails = filterDetails;
  };

  setFilterDirection = (filterDirection: string | null) => {
    this.filterDirection = filterDirection;
  };

  setFilterCreateProductProductName = (
    filterCreateProductProductName: string | null
  ) => {
    this.filterCreateProductProductName = filterCreateProductProductName;
  };

  setFilterCreateProductProductModelName = (
    filterCreateProductProductModelName: string | null
  ) => {
    this.filterCreateProductProductModelName =
      filterCreateProductProductModelName;
  };

  setFilterCreateProductCategory = (
    filterCreateProductCategory: string | null
  ) => {
    this.filterCreateProductCategory = filterCreateProductCategory;
  };

  setFilterCreateProductModel = (filterCreateProductModel: string | null) => {
    this.filterCreateProductModel = filterCreateProductModel;
  };

  setFilterCreateProductTissue = (filterCreateProductTissue: string | null) => {
    this.filterCreateProductTissue = filterCreateProductTissue;
  };

  setFilterCreateProductTissueColor = (
    filterCreateProductTissueColor: string | null
  ) => {
    this.filterCreateProductTissueColor = filterCreateProductTissueColor;
  };

  setCreateProductPageNumber = (createProductPageNumber: number) => {
    this.createProductPageNumber = createProductPageNumber;
  };

  setCreateProductPageSize = (createProductPageSize: number) => {
    this.createProductPageSize = createProductPageSize;
  };

  setCartProductPageNumber = (cartProductPageNumber: number) => {
    this.cartProductPageNumber = cartProductPageNumber;
  };

  setCartProductPageSize = (cartProductPageSize: number) => {
    this.cartProductPageSize = cartProductPageSize;
  };

  setSingleStorekeeper = (singleStorekeeper: IAddUser | null) => {
    this.singleStorekeeper = singleStorekeeper;
  };

  setHaveOldUser = (haveOldUser: IUser | null | any) => {
    this.isHaveOldUser = haveOldUser;
  };

  setisOpenHaveOldUserError = (isOpen: boolean) => {
    this.isOpenHaveOldUserError = isOpen;
  };

  reset() {
    this.isOpenAddNewWarehouseModal = false;
  }

  setFilterApplicationsParams = (value: ApplicationsFilterParams) => {
    this.filterApplicationsParams = value;
  };

  setApplicationsPageSize = (value: number) => {
    this.applicationsPageSize = value;
  };

  setApplicationsPageNumber = (value: number) => {
    this.applicationsPageNumber = value;
  };

  setIsOpneAddApplicationModal = (value: boolean) => {
    this.isOpneAddApplicationModal = value;
  };

  setLocalApplication = (value: IAddResponseApplication | null) => {
    this.localApplication = value;
    localStorage.setItem('request', JSON.stringify(value));
  };
  setisOpenAddProductApplicationModal = (value: boolean) => {
    this.isOpenAddProductApplicationModal = value;
  };

  setEdtiLocalApplication = (value: IAddApplication) => {
    this.edtiLocalApplication = value;
  };

  setApplicationProductSearch = (searchQuery: string) => {
    this.applicationProductSearch = searchQuery;
  };

  setApplicationProductsPageNumber = (pageNumber: number) => {
    this.applicationProductsPageNumber = pageNumber;
  };

  setApplicationProductsPageSize = (pageSize: number) => {
    this.applicationProductsPageNumber = pageSize;
  };
  setLocalReqProducts = (value: IMainStorekeeperProductList[]) => {
    this.localReqProducts = value;
  };

  setIsOpenEditReqProductModal = (value: boolean) => {
    this.isOpenEditReqProductModal = value;
  };

  setReqProductQty = (value: IEditReqProductParams) => {
    this.reqProductQty = value;
  };

  setIsOpenIsOpenOrderProductModal = (value: boolean) => {
    this.isOpenOrderProductModal = value;
  };

  setWarehouseOrderProduct = (value: IMainStorekeeperProductList) => {
    this.warehouseOrderProduct = value;
  };
}

export const mainStorekeeperStore = new MainStorekeeperStore();
