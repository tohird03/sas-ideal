import {AxiosResponse} from 'axios';
import {Endpoints, pmsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IAddCategory,
  IAllCategoryWIthSub,
  ICategoryParams,
  IGetCategory,
  IGetCategoryList,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.PmsBase,
  stageUrl: pmsStages.apiUrl,
};

class CategoryApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCategory = (params: ICategoryParams): Promise<IGetCategory> =>
    this.get(Endpoints.Category, {params});

  getCategorySelect = (pageSize = 1000): Promise<IGetCategory> =>
    this.get(`${Endpoints.Category}?pageSize=${pageSize}`);

  addCategory = (params: IAddCategory): Promise<AxiosResponse> =>
    this.post(Endpoints.Category, params);

  updateCategory = (params: IAddCategory): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Category}/${params?.id}`, params);

  getSubCategory = (): Promise<IAllCategoryWIthSub> =>
    this.get(Endpoints.SubCategory);

  getSubCategoryWithSubs = (id: string): Promise<IGetCategoryList> =>
    this.get(`${Endpoints.SubCategory}/${id}`);
}

export const categoryApi = new CategoryApi(config);
