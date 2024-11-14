import {makeAutoObservable} from 'mobx';
import {companysApi} from '@/api/companys/companys';
import {IAddCompany, ICompany, ICompanyParams} from '@/api/companys/types';
import {addNotification} from '@/utils/addNotification';

class CompanysStore {
  allCompanys: ICompany[] = [];
  company: ICompany | null = null;
  totalCompanys = 0;
  pageNumber = 1;
  pageSize = 10;
  dynamicModalOpen = false;
  name = '';

  constructor() {
    makeAutoObservable(this);
  }

  getCompanys = (params: ICompanyParams) =>
    companysApi.getCompanys(params)
      .then((res) => {
        if (res) {
          this.setAllCompanys(res?.companyList);
          this.setTotalCompanys(res?.total);
        }

        return res;
      })
      .catch(addNotification);

  postCompany = (params: IAddCompany) =>
    companysApi.postCompanys(params)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('Успешно добавлено нового компания');
        }

        return res;
      })
      .catch(addNotification);

  editCompany = (id: string, params: IAddCompany) =>
    companysApi.putCompanys(id, params)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('Компания успешна изменено');
        }

        return res;
      })
      .catch(addNotification);

  deleteCompany = (id: string) =>
    companysApi.deleteCompanys(id)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('Компания успешна удалено');
        }

        return res;
      })
      .catch(addNotification);

  setCompany = (company: ICompany | null) => {
    this.company = company;
  };

  setAllCompanys = (companys: ICompany[]) => {
    this.allCompanys = companys;
  };

  setTotalCompanys = (totalCompanys: number) => {
    this.totalCompanys = totalCompanys;
  };

  setDynamicModalOpenOrClose = (param: boolean) => {
    this.dynamicModalOpen = param;
  };

  setName = (name: string) => {
    this.name = name;
  };

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  reset() {
    this.allCompanys = [];
  }
}

export const companysStore = new CompanysStore();
