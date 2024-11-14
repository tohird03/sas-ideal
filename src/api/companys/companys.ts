import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IAddCompany, ICompany, ICompanyData, ICompanyParams} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class CompanysApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getCompanys = (params: ICompanyParams): Promise<ICompanyData> =>
    this.get(Endpoints.Companys, {params});

  postCompanys = (params: IAddCompany) =>
    this.post(`${Endpoints.PostCompany}`, params);

  putCompanys = (id: string, params: IAddCompany) =>
    this.patch(`${Endpoints.PutCompany}/${id}`, params);

  deleteCompanys = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.DeleteCompany}/${id}`);

  getCompanyFull = (): Promise<ICompany> =>
    this.get(Endpoints.UmsCompanyfull);
}

export const companysApi = new CompanysApi(config);
