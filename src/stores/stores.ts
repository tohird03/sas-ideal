import {appStore} from './app';
import {authStore} from './auth';
import {breadcrumbStore} from './breadcrumb';
import {profileStore} from './profile';
import {clientsInfoStore, paymentsStore} from './clients';
import {staffsStore} from './workers';
import {supplierInfoStore} from './supplier';
import {productsListStore, incomeProductsStore, ordersStore} from './products';

export const stores = {
  appStore,
  authStore,
  breadcrumbStore,
  profileStore,
  staffsStore,
  clientsInfoStore,
  paymentsStore,
  supplierInfoStore,
  productsListStore,
  incomeProductsStore,
  ordersStore,
};

export const resetStores = () => {
  appStore.reset();
  authStore.reset();
  breadcrumbStore.reset();
  profileStore.reset();
  staffsStore.reset();
  clientsInfoStore.reset();
  paymentsStore.reset();
  supplierInfoStore.reset();
  productsListStore.reset();
  incomeProductsStore.reset();
  ordersStore.reset();
};
