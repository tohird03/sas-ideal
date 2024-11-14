import {makeAutoObservable, observable} from 'mobx';
import {MenuProps} from 'antd';
import {authApi} from '@/api';
import {ILoginForm} from '@/api/auth/types';
import {mainMenuList} from '@/modules/Layout/constants';
import {generateAllMenuItems} from '@/modules/Layout/utils';
import {addNotification} from '@/utils/addNotification';
import {IStaff} from '../profile/types';
import {TokenType} from './types';

class AuthStore {
  isAuth: boolean | null = false;
  token: TokenType | null = null;
  staffInfo: IStaff | null = null;
  mainMenuItems: MenuProps['items'] | null = null;

  constructor() {
    makeAutoObservable(this, {
      isAuth: observable,
    });
  }

  getSignIn = (params: ILoginForm) =>
    authApi.getSignIn(params)
      .then(res => {
        if (res?.data) {
          this.setToken({
            accessToken: res.data?.accessToken,
            refreshToken: res?.data?.refreshToken,
          });
          this.setIsAuth(true);
        }

        return res;
      })
      .catch(addNotification);

  getProfile = () =>
    authApi.getUserProfile()
      .then(res => {
        if (res) {
          this.setStaffInfo(res);
          // this.mainMenuItems = generateAllMenuItems(mainMenuList, res);
        }
      })
      .catch(addNotification);

  setMainMenuItems = (menuItems: MenuProps['items'] | null) => {
    this.mainMenuItems = menuItems;
  };

  logout = (refreshToken: string) =>
    authApi.logout(refreshToken)
      .then(res => {
        if (res.status === 204) {
          addNotification('Success logout');
        }

        return res;
      })
      .catch(addNotification);

  setStaffInfo = (staffInfo: IStaff) => {
    this.staffInfo = staffInfo;
  };

  setToken = (token: TokenType) => {
    this.token = token;
  };

  setIsAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };

  reset = () => {
    this.isAuth = null;
    this.token = null;
    this.staffInfo = null;
    window.localStorage.clear();
  };
}

export const authStore = new AuthStore();
