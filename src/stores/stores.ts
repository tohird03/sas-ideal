import {appStore} from './app';
import {authStore} from './auth';
import {breadcrumbStore} from './breadcrumb';
import {profileStore} from './profile';
import {clientsInfoStore} from './clients';
import {staffsStore} from './workers';
import {supplierInfoStore} from './supplier';

export const stores = {
  appStore,
  authStore,
  breadcrumbStore,
  profileStore,
  staffsStore,
  clientsInfoStore,
  supplierInfoStore,
};

export const resetStores = () => {
  appStore.reset();
  authStore.reset();
  breadcrumbStore.reset();
  profileStore.reset();
  staffsStore.reset();
  clientsInfoStore.reset();
  supplierInfoStore.reset();
};
