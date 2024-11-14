import {TStage} from './types';
export const stage = process.env.REACT_APP_STAGE || 'dev';

export enum Endpoints {
  Base = '/api/v1',
  PmsBase = '/api/v1/pricing',
  SmsBase = '/api/v1',
  WmsBase = '/api/v1/warehouse',
  DmsBase = '/api/v1/delivery',

  // UMS
  SignIn = '/dashboard-auth/sign-in',
  SignOut = '/dashboard-auth/sign-out',
  RefreshToken = '/dashboard-auth/refresh',
  Users = '/dashboard-profile',
  UsersByRole = '/dashboard-profile/by-role',
  AddUserToShowroom = '/selling-profile',
  AddUserToWarehouse = '/warehouse-profile',
  RemoveUserFromShowroom = '/showroom/disconnect-user',
  ConnectUserToShowroom = '/showroom/connect-user',
  GetShowroomUsers = '/showroom/users',
  UserProfile = '/dashboard-profile/profile',
  DeleteUser = '/dashboard-profile/user/{id}',
  GetSingleUser = '/dashboard-profile/user/{id}',
  UserResetPassword = '/dashboard-profile/user/reset-password/{id}',
  AllRoles = '/dashboard/role/all',
  SingleRole = '/dashboard/role/{id}',
  AllCompanies = '/dashboard-profile/company-full',
  Companys = '/dashboard-profile/company',
  CompanyProfile = '/dashboard-profile/company/{id}',
  PostCompany = '/dashboard-profile/company',
  PutCompany = '/dashboard-profile/company',
  DeleteCompany = '/dashboard-profile/company',
  UmsCompanyfull = '/dashboard-profile/company-full',
  UmsRevokeUser = '/dashboard-profile/revoke-role',

  RoleByName = '/dashboard/role/by-name',
  UmsAllRoles = '/dashboard/role/all',
  UmsAddRole = '/dashboard/role/create',
  UmsDeleteRole = '/dashboard/role/delete',
  UmsPermessionByRole = '/dashboard/role/{id}',
  UmsAssignPerToRole = '/dashboard/role/permissions-assign',
  UmsUnAssignPerToRole = '/dashboard/role/permissions-unassign',
  UmsProvider = '/provider-profile',
  UmeProviderUsers = '/provider-profile/users',
  UmeProviderUsersAdd = '/provider-profile/qa-storekeeper',
  UmsCashbox = '/cashbox',
  UmsCashier = '/cashier-profile',
  UmsPaymentType = '/payment-type',
  UmsPaymentTypeFull = '/payment-type/full',
  UmsTransferMoneyFromCashbox = '/transfer-money',
  UmsPayment = '/payment',
  UmsMainSellerUsers = '/seller-profile',
  UmsCashierAction = '/cashier-action',

  // PMS
  Process = '/process',
  Category = '/category',
  Direction = '/direction',
  Provider = '/provider',
  SubCategory = '/category/with-subs',
  MyTasks = '/task/user',
  Model = '/model',
  Unit = '/unit',
  GetBase = '/base',
  GetDirection = '/pricing/direction',
  PostBase = '/base',
  PmsUnit = '/unit',
  PmsBaseCategory = '/base-category',
  PmsDeleteBase = '/base',
  PmsBaseEdit = '/base',
  PmsDeleteTask = '/task',
  PmsGetTaskId = '/task',
  PmsProductListGet = '/pricing/product',
  PmsEngProductListPost = '/pricing/product/engineer',
  PmsProductListPost = '/pricing/product',
  PmsProductListDelete = '/pricing/product',
  PmsProductListPatch = '/pricing/product',
  PmsProvider = '/pricing/provider',
  PmsProductUpdateWorOn = '/pricing/product',
  PmsRolePermession = '/dashboard-profile/user/permissions',
  AllShowroom = '/showroom/full',
  Showroom = '/showroom',
  PmsCombinationGet = '/pricing/combination',

  PmsTissue = '/tissue',
  PmsColorByTissue = '/tissue-color',
  PmsCategoryGet = '/pricing/category',
  PmsDirectionGet = '/pricing/direction',
  PmsModelGet = '/pricing/model',

  PmsPmProductsGet = '/pricing/product',
  PmsStorekeeperProductsGet = '/product',
  PmsPmProductAdd = '/pricing/product',
  PmsPmBulkUpdate = '/pricing/product/bulk-price-factors',
  PmsPmPiceFactorBulkUpdate = '/pricing/old-price-factor/bulk-update',
  PmsProductsSellerPersentBulkUpdate = '/pricing/old-price-factor/seller-percent-bulk-update',
  PmsExpenseType = '/spend-type',

  PmsPromotion = '/promotion',
  PmsPromotionProducts = '/promotion-product',

  // WMS
  WmsMainStProduct = '/product',
  WmsProductStatus = '/product-status',
  WmsGeneratePartId = '/product/generate-id',
  WmsWarehouses = '/warehouse',
  WmsWarehouseType = '/warehouse-type',
  WmsWarehouseUser = '/warehouse/users',
  WmsProductToCard = '/cart',
  WmsGetGenerationPartId = '/product/generate-id',
  WmsCheckGeneratePartId = '/product/check-id',
  WmsProductChangeMinCount = '/min-quantity',

  WmsStorekeeperProductsGet = '/product/storekeeper',
  WmsProviderUploadProduct = '/product/provider',
  WmsCategoryGet = '/category',
  WmsDirectionsGet = '/direction',
  WmsAllWarehousesGet = '/warehouse/full',
  WmsModelGet = '/model',
  WmsProductStatusGet = '/product-status',
  WmsEditProductStatusQty = '/product',
  WmsAddProductCart = '/cart',
  WmsSubmitProducts = '/product/storekeeper',
  WmsGetRequests = '/reqeusts',
  WmsRequestsToWarehouse = '/reqeusts/to-warehouse',
  WmsRequestToWarehouseProducts = '/reqeusts-product/to-warehouse',
  WmsGetRequestProducts = '/reqeusts-product',

  WmsProviderOrders = '/order',
  WmsOrderWarehouseProduct = '/order',

  // DMS
  DmsLocations = '/location',
  DmsCouriers = '/courier',
  DmsRequestFromWms = '/reqeusts',
  DmsCourierFlights = '/delivery',
  DmsCourierFlightProducts = '/delivery/products',
  DmsClosedFlights = '/courier/delivery-admin',
  DmsRequestProducts = '/reqeusts-product',

  // SMS
  SmsClientFrom = '/client-from',
  SmsClientStatus = '/clientStatus',
  SmsNewProducts = '/product',
  SmsAboutVisitedClients = '/visit',
  SmsBasketProducts = '/cart',
  SmsAddProductToBasket = '/cart/add',
  SmsClients = '/client',
  SmsOrder = '/order',
  SmsSellerOrder = '/order/public',
  SmsPrePaymentToOrder = '/order-payment-info',
  SmsMyOrderDetails = '/order-details',
  SmsOrderDetailsCancel = '/order-details/cancel',
  SmsSaleProducts = '/order/with-payment-details',
  SmsOrderDetailChange = '/order-detail-change',
}

const umsConfigs: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://ums.mydevops.uz',
  },
  prod: {
    apiUrl: 'https://prod.mydevops.uz',
  },
};

const pmsConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://pms.mydevops.uz',
  },
  prod: {
    apiUrl: 'https://prodpms.mydevops.uz',
  },
};

const smsConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://sms.mydevops.uz',
  },
  prod: {
    apiUrl: 'https://sms.mydevops.uz',
  },
};


const imgConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
  prod: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
};


export const umsStages = umsConfigs[stage];
export const pmsStages = pmsConfig[stage];
export const smsStages = smsConfig[stage];
export const imgStages = imgConfig[stage];
