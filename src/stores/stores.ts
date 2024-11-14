import {appStore} from './app';
import {authStore} from './auth';
import {basesStore} from './base';
import {breadcrumbStore} from './breadcrumb';
import {cashboxStore, cashierRequestStore, cashierUserStore, paymentTypeStore} from './cashier';
import {categoriesStore} from './categories';
import {changesStore, ordersStore} from './centralOperator';
import {companysStore} from './company';
import {courierStores, locationsStore, requestStore} from './dms';
import {mainStorekeeperStore, warehouseListStore, warehouseTypeStore} from './mainStorekkeper';
import {promotionStore} from './marketer';
import {modelStore} from './model';
import {myLogsStore} from './myLogs';
import {pmProductListStore} from './pmPRoduct';
import {processStore} from './process';
import {pmDirectionStore, pmExpenseStore, pmProviderStore} from './productManager';
import {profileStore} from './profile';
import {applyProductsStore, myUsersStore, relatedProductsStore} from './provider';
import {applyProductsQaStore} from './providerQA';
import {roleStore} from './role';
import {
  clientInfoStore,
  mainSellerMyUsersStore,
  motivationStore,
  sellerProductStore,
  sellerShowroomsStore,
  visitedClientsStore} from './seller';
import {storekeeperRequestStore} from './storekeeper';
import {rolesStore} from './superAdmin';
import {tissueStore} from './tissue';
import {usersStore} from './users';
import {warehouseStore} from './warehouse';
import {workOnStore} from './workon';

export const stores = {
  appStore,
  authStore,
  breadcrumbStore,
  profileStore,
  categoriesStore,
  companysStore,
  modelStore,
  myLogsStore,
  processStore,
  usersStore,
  workOnStore,
  basesStore,
  pmProductListStore,
  mainStorekeeperStore,
  tissueStore,
  warehouseStore,
  roleStore,
  locationsStore,
  courierStores,
  requestStore,
  pmDirectionStore,
  pmExpenseStore,
  warehouseTypeStore,
  warehouseListStore,
  pmProviderStore,
  applyProductsStore,
  myUsersStore,
  relatedProductsStore,
  applyProductsQaStore,
  promotionStore,
  cashboxStore,
  paymentTypeStore,
  clientInfoStore,
  ordersStore,
  changesStore,
  sellerProductStore,
  storekeeperRequestStore,
  cashierUserStore,
  sellerShowroomsStore,
  motivationStore,
  mainSellerMyUsersStore,
  cashierRequestStore,
  visitedClientsStore,
  rolesStore,
};

export const resetStores = () => {
  appStore.reset();
  authStore.reset();
  breadcrumbStore.reset();
  profileStore.reset();
  categoriesStore.reset();
  companysStore.reset();
  modelStore.reset();
  myLogsStore.reset();
  processStore.reset();
  usersStore.reset();
  workOnStore.reset();
  basesStore.reset();
  mainStorekeeperStore.reset();
  tissueStore.reset();
  warehouseStore.reset();
  roleStore.reset();
  locationsStore.reset();
  courierStores.reset();
  requestStore.reset();
  pmDirectionStore.reset();
  pmExpenseStore.reset();
  warehouseTypeStore.reset();
  warehouseListStore.reset();
  pmProviderStore.reset();
  applyProductsStore.reset();
  myUsersStore.reset();
  relatedProductsStore.reset();
  applyProductsQaStore.reset();
  promotionStore.reset();
  cashboxStore.reset();
  paymentTypeStore.reset();
  clientInfoStore.reset();
  ordersStore.reset();
  changesStore.reset();
  sellerProductStore.reset();
  storekeeperRequestStore.reset();
  cashierUserStore.reset();
  sellerShowroomsStore.reset();
  motivationStore.reset();
  mainSellerMyUsersStore.reset();
  cashierRequestStore.reset();
  visitedClientsStore.reset();
  rolesStore.reset();
};
