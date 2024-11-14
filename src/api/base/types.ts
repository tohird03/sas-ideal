export interface IBaseParams {
  name: string;
  pageNumber: number;
  pageSize: number;
  baseCategoryId?: string;
}

export interface IBase {
  name: string;
  id: string;
  images: [];
  baseCategory: IBaseCategoryList;
  unit: IUnitList;
}

export interface IBaseData {
  name: string;
  count: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  baseList: IBase[];
}

export interface IBaseAdd {
  name: string;
  baseCategoryId: string;
  images: string[];
  unitId: string;
}
export interface IBaseEdit {
  name: string;
  baseCategoryId: string;
  imagesToCreate: string;
  imagesToRemove: string[];
  unitId: string;
}

export interface IUnitList {
  id: string;
  name: string;
}

export interface IUnitParams {
  count: number;
  unitList: IUnitList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IBaseCategoryList {
  id: string;
  name: string;
}

export interface IBaseCategoryParams {
  count: number;
  baseCategoryList: IBaseCategoryList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}


export interface IGetBaseCategory1 {
  id?: string;
  name: string;
  subcategories: IGetBaseCategory1[];
}
