import {IPagination} from '../types';

export interface ICategories {
  id: string;
  title: string;
  category: {
    id: string;
    title: string;
  };
}

export interface IGetCategory {
  count: number;
  categoryList: ICategories[];
  pageNumber: number;
  pageSize: number;
}

export interface ICategoryParams extends IPagination {
  title?: string;
}

export interface IAddCategory {
  title: string;
  categoryId?: string | null;
  id?: string;
}

export interface IGetSubCategoryParams extends IPagination {
  title: string;
}

export interface IAllCategoryWIthSub {
  categoryList: IGetCategoryList[];
}

export interface IGetCategoryList {
  id?: string;
  title: string;
  subcategories: IGetCategoryList[];
}
