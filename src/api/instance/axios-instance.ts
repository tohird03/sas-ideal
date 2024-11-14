import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Endpoints} from '@/api/endpoints';
import {IResponse} from '@/api/types';
import {stores} from '@/stores';
import {authStore} from '@/stores/auth';
import {addNotification} from '@/utils';
import {resetUser} from '@/utils/signOut';
import {INetworkConfig, TMethod} from './types';

export class Instance {
  protected readonly instance: AxiosInstance;
  protected baseURL = '';
  protected stageUrl = '';
  protected failedRequestsQueue: {
    method: TMethod;
    url: string;
    params?: any;
    config?: AxiosRequestConfig;
    base: string;
    stage: string;
  } | null = null;

  public constructor({baseURL = Endpoints.Base, stageUrl = '', headers, timeout = 65000}: INetworkConfig) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers,
    });
    // @ts-ignore
    this.instance.interceptors.request.use(this.handleRequest);
    this.instance.interceptors.response.use(this.handleResponse, this.handleResponseError);
    this.baseURL = baseURL;
    this.stageUrl = stageUrl;
  }

  handleResponse = <T>(response: AxiosResponse<IResponse<T>>) => response;

  private handleResponseError = (error: AxiosError) => {
    if (error.response?.status === 401) {
      addNotification('Попробуйте еще раз');

      this.instance.post(
        'https://ums.mydevops.uz/api/v1/dashboard-auth/refresh',
        {refreshToken: authStore.token?.refreshToken},
        {baseURL: `${this.stageUrl}${this.baseURL}`}
      )
        .then(res => {
          if (res?.status === 200) {
            window.localStorage.setItem('accessToken', JSON.stringify(res?.data?.accessToken));
            window.localStorage.setItem('refreshToken', JSON.stringify(res?.data?.refreshToken));
            authStore.setToken({
              accessToken: res?.data?.accessToken,
              refreshToken: res?.data?.refreshToken,
            });
          }
        })
        .catch(err => {
          if (err?.response?.status === 403) {
            resetUser();
          }
        });
    }

    throw error;
  };

  private handleRequest = async ({headers, ...restConfig}: AxiosRequestConfig) => {
    const {authStore} = stores;
    const accessToken = authStore.token?.accessToken;

    return {
      headers: {
        ...headers,
        ...(accessToken && {Authorization: `Bearer ${authStore.token?.accessToken}`}),
      },
      ...restConfig,
    };
  };

  public async send(method: TMethod, url: string, params?: any, config?: AxiosRequestConfig) {
    return this.instance[method](url, params, {...config, baseURL: `${this.stageUrl}${this.baseURL}`});
  }

  public async get(url: string, params?: any) {
    const {data} = await this.instance.get(`${this.stageUrl}${this.baseURL}${url}`, {...params});

    return data;
  }

  public async post(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, params, {...config, baseURL: `${this.stageUrl}${this.baseURL}`});
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, {...config, baseURL: `${this.stageUrl}${this.baseURL}`});
  }

  public async put(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, params, {...config, baseURL: `${this.stageUrl}${this.baseURL}`});
  }

  public async patch(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.instance.patch(url, params, {...config, baseURL: `${this.stageUrl}${this.baseURL}`});
  }
}
