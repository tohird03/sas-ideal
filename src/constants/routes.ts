export const ROUTES = {
  home: '/',
  signIn: '/signin',
  dashboard: '/home',
  users: '/home/users',
  myProfileHome: '/my-profile',
  userEdit: '/home/:id',
  userAdd: '/home/add',
  companys: '/home/companies',
  roles: '/roles',

  pms: '/pms',
  process: '/pms/process',
  category: '/pms/category',
  tasks: '/pms/tasks',
  model: '/pms/model',
  workOn: '/pms/workon/:id/work-on',
  base: '/pms/base',
  product: '/pms/Product',

  // PROVIDER
  provider: '/provider',
  providerApplyProducts: '/provider/apply-products',
  providerRelatedProducts: '/provider/related-products',
  providerMyUsers: '/provider/my-users',

  // PROVIDER QA
  providerQa: '/provider-qa',
  providerQaApplyProducts: '/provider-qa/apply-products',

  // STOREKEEPER
  storekeeper: '/storekeeper',
  storekeeperMain: '/storekeeper/main',
  storekeeperAddProductBasket: '/storekeeper/main/add-product-basket',
  storekeeperBasket: '/storekeeper/main/basket',
  storekeeperMainMore: '/storekeeper/main/more',
  storekeeperRequest: '/storekeeper/request',
  storekeeperSingleRequest: '/storekeeper/request/:requestId',

  // MAIN_STOREKEEPER
  mainStorekeeperMyOrder: '/mainstorekeeper/myorder',
  mainStorekeeperNotification: '/mainstorekeeper/notification',
  mainStorekeeperStock: '/mainstorekeeper/stock',
  mainStorekeeperCreateProduct: '/mainstorekeeper/create',
  mainStorekeeperExhibitionHalls: '/mainstorekeeper/exhibiting-halls',
  mainStorekeeperCart: '/mainstorekeeper/cart',
  mainStorekeeperApplications: '/mainstorekeeper/applications',
  mainStorekeeperApplicationAddEdit: '/mainstorekeeper/application-add-edit',
  mainStorekeeperApplicationAddEditById:
    '/mainstorekeeper/application-add-edit/:id',
  mainStorekeeperWarehouseType: '/mainstorekeeper/warehouse-type',
  mainStorekeeperWarehouseList: '/mainstorekeeper/warehouse-list',
  mainStorekeeperWarehouseProducts:
    '/mainstorekeeper/warehouse-list/:warehouseId',

  directorSellerNotification: '/directorseller/notification',
  directorSellerShowroom: '/directorseller/showroom',
  productManager: '/productmanager',
  productManagerMain: '/productmanager/main',
  productManagerCategory: '/productmanager/category',
  productManagerModel: '/productmanager/model',
  productManagerPricing: '/productmanager/pricing',
  productManagerProvider: '/productmanager/provider',
  productManagerTasks: '/productmanager/tasks',
  productManagerSets: '/productmanager/sets',
  productManagerTissue: '/productmanager/tissue',
  productManagerColorByTissue: '/productmanager/:id',
  pmsManagerDirection: '/productmanager/direction',
  pmsManagerExpense: '/productmanager/expense',

  pmsMr: '/pms-mr',
  pmsMrCategory: '/pms-mr/category',
  pmsMrModel: '/pms-mr/model',

  //DELIVERY
  dms: '/dms',
  dmsRequest: '/dms/request',
  dmsCreateFlight: '/dms/create-flight/:requestId',
  dmsCourier: '/dms/courier',
  dmsLocation: '/dms/location',
  dmsReward: '/dms/reward',

  // MARKETER
  marketer: '/marketer',
  marketerPromotion: '/marketer/promotion',
  marketerSinglePromotion: '/marketer/promotion/:promotionId',

  //MAIN CASHIER
  mainCashier: '/main-cashier',
  mainCashierCashiers: '/main-cashier/cashier',
  mainCashierCashbox: '/main-cashier/cashbox',
  mainCashierPaymentType: '/main-cashier/payment-type',

  // CASHIER
  cashier: '/cashier',
  cashierRequests: '/cashier/requests',

  // SELLER DIRECTOR
  sellerDirector: '/seller-director',
  sellerDirectorShowrooms: '/seller-director/showrooms',
  sellerDirectorClientInfo: '/seller-director/client-info',
  sellerDirectorMotivation: '/seller-director/motivation',

  // MAIN SELLER
  mainSeller: '/main-seller',
  mainSellerUsers: '/main-seller/users',

  // CENTRAL OPERATOR
  centarlOperator: '/central-operator',
  centarlOperatorOrders: '/central-operator/orders',
  centarlOperatorSingleOrder: '/central-operator/orders/:orderId',
  centarlOperatorChanges: '/central-operator/changes',

  // SELLER
  seller: '/seller',
  sellerProducts: '/seller/products',
  sellerMyOrders: '/seller/my-orders',
  sellerMySingleOrder: 'seller/my-orders/:orderId',
  sellerBasketProducts: '/seller/basket-products',
  sellerAboutVisitedClients: '/seller/about-clients',
  sellerOrderCheckAndSale: '/seller/order-check-and-sale',
} as const;

export const roleChecker = {
  storeKeeper: 'storekeeper',
  mainStoreKeeper: 'main-storekeeper',
};
