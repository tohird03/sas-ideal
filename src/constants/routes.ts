export const ROUTES = {
  home: '/',
  signIn: '/signin',
  myProfileHome: '/my-profile',

  // STAFFS
  workers: '/workers',
  workersStaffs: '/workers/staffs',

  // CLIENTS
  clients: '/clients',
  clientsInfo: '/clients/clients-info',

  // SUPPLIER
  supplier: '/supplier',
  supplierInfo: '/supplier/supplier-info',

  // PRODUCTS
  products: '/products',
  productsList: '/products/list',
} as const;

export const roleChecker = {
  storeKeeper: 'storekeeper',
  mainStoreKeeper: 'main-storekeeper',
};
