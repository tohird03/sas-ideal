export interface ICompany {
  id: string;
  name: string;
}

export interface IAddCompany {
  name: string;
}

export interface ICompanyData {
  page: number;
  per_page: number;
  total: number;
  count: number;
  companyList: ICompany[];
}
export interface ICompanyParams {
  pageNumber: number;
  pageSize: number;
  name: string;
}

export interface IPutCompany {
  id: string;
  name: string;
}
