import {appStore} from './app';
import {authStore} from './auth';
import {breadcrumbStore} from './breadcrumb';
import {profileStore} from './profile';
import {staffsStore} from './workers';
import {clientsInfoStore} from './clients';

export const stores = {
  appStore,
  authStore,
  breadcrumbStore,
  profileStore,
  staffsStore,
  clientsInfoStore,
};

export const resetStores = () => {
  appStore.reset();
  authStore.reset();
  breadcrumbStore.reset();
  profileStore.reset();
  staffsStore.reset();
  clientsInfoStore.reset();
};
