import {useEffect, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {useStores} from '@/stores';
import {TokenType} from '@/stores/auth';
import { generateAllMenuItems } from '@/modules/Layout/utils';
import { mainMenuList } from '@/modules/Layout/constants';

export const useBootstrap = () => {
  const {authStore} = useStores();
  const [isInitiated, setIsInitiated] = useState(true);
  const [accessToken] = useLocalStorage<TokenType['accessToken']>('accessToken', '');
  const [refreshToken] = useLocalStorage<TokenType['refreshToken']>('refreshToken', '');

  const getProfile = async () => {
    authStore.getProfile();
  };
  const setToken = async () => {
    authStore.setMainMenuItems(generateAllMenuItems(mainMenuList));

    if (accessToken && refreshToken) {
      authStore.setIsAuth(true);
      await authStore.setToken({
        accessToken,
        refreshToken,
      });

      await getProfile();

    }
  };


  const getAppConfigs = async () => {
    try {
      await setToken();

      setIsInitiated(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAppConfigs();
  }, []);

  return [isInitiated];
};
