import {lazy} from 'react';
import {Loading} from '@/components';

const handleCatchChunkError = () => {
  window.location.reload();

  return {default: Loading};
};


export const MyProfileHome = lazy(() =>
  import('@/pages/MyProfile').then(({MyProfile}) => ({default: MyProfile})).catch(handleCatchChunkError));

export const Login = lazy(() =>
  import('@/pages/Login').then(({Login}) => ({default: Login})).catch(handleCatchChunkError));

// STAFFS
export const Staffs = lazy(() =>
  import('@/pages/Workers').then(({Staffs}) => ({default: Staffs})).catch(handleCatchChunkError));

// CLIENTS
export const ClientsInfo = lazy(() =>
  import('@/pages/Clients').then(({ClientsInfo}) => ({default: ClientsInfo})).catch(handleCatchChunkError));

// SUPPLIER
export const SupplierInfo = lazy(() =>
  import('@/pages/Supplier').then(({SupplierInfo}) => ({default: SupplierInfo})).catch(handleCatchChunkError));

// PRODUCTS
export const ProductsList = lazy(() =>
  import('@/pages/Products').then(({ProductsList}) => ({default: ProductsList})).catch(handleCatchChunkError));

export const IncomeProducts = lazy(() =>
  import('@/pages/Products').then(({IncomeProducts}) => ({default: IncomeProducts})).catch(handleCatchChunkError));

export const Orders = lazy(() =>
  import('@/pages/Products').then(({Orders}) => ({default: Orders})).catch(handleCatchChunkError));
