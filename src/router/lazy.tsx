import { lazy } from 'react';
import { Loading } from '@/components';

const handleCatchChunkError = () => {
  window.location.reload();

  return { default: Loading };
};


export const MyProfileHome = lazy(() =>
  import('@/pages/MyProfile').then(({ MyProfile }) => ({ default: MyProfile })).catch(handleCatchChunkError));

export const Login = lazy(() =>
  import('@/pages/Login').then(({ Login }) => ({ default: Login })).catch(handleCatchChunkError));

// STAFFS
export const Staffs = lazy(() =>
  import('@/pages/Workers').then(({ Staffs }) => ({ default: Staffs })).catch(handleCatchChunkError));

// CLIENTS
export const ClientsInfo = lazy(() =>
  import('@/pages/Clients').then(({ClientsInfo}) => ({default: ClientsInfo})).catch(handleCatchChunkError));
