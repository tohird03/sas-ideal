import {makeAutoObservable} from 'mobx';
import {categoryApi} from '@/api/categories';
import {IAddCategory,
  IAllCategoryWIthSub,
  ICategories,
  ICategoryParams,
  IGetCategoryList,
  IGetSubCategoryParams,
} from '@/api/categories/types';
import {addNotification} from '@/utils';

class CategoriesStore {
  categories: ICategories[] = [];
  subCategories: IGetCategoryList[] = [];
  totalCategories = 0;
  page = 1;
  limit = 10;
  search = '';
  singleCategory: ICategories | null = null;
  singleSubCategory: IAllCategoryWIthSub | null = null;
  isOpenNewCategoryModal = false;
  subCategoryId: any = null;


  constructor() {
    makeAutoObservable(this);
  }

  getSubCategory = () =>
    categoryApi.getSubCategory()
      .then(res => {
        if (res) {
          this.setSubCategory(res?.categoryList);
        }

        return res;
      })
      .catch(addNotification);

  getCategory = (params: ICategoryParams) =>
    categoryApi.getCategory(params)
      .then(res => {
        if (res) {
          this.setCategory(res?.categoryList);
          this.setTotal(res?.count);
        }

        return res;
      })
      .catch(addNotification);

  getCategorySelect = () =>
    categoryApi.getCategorySelect()
      .then(res => res)
      .catch(addNotification);

  getSubCategoryWithSubs = (id: string) =>
    categoryApi.getSubCategoryWithSubs(id)
      .then(res => res)
      .catch(addNotification);

  addCategory = (params: IAddCategory) =>
    categoryApi.addCategory(params);

  uptadeCategory = (params: IAddCategory) =>
    categoryApi.updateCategory(params);

  setSubCategoryId = (id: string | null) => {
    this.subCategoryId = id;
  };


  setSubCategory = (subCategory: IGetCategoryList[]) => {
    this.subCategories = subCategory;
  };

  setCategory = (category: ICategories[]) => {
    this.categories = category;
  };

  setTotal = (total: number) => {
    this.totalCategories = total;
  };

  setPage = (page: number) => {
    this.page = page;
  };

  setLimit = (limit: number) => {
    this.limit = limit;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setSingleCategory = (singleCategory: ICategories | null) => {
    this.singleCategory = singleCategory;
  };

  setSubSingleCategory = (subSingleCategory: IAllCategoryWIthSub | null) => {
    this.singleSubCategory = subSingleCategory;
  };

  setIsOpenNewCategoryModal = (isOpen: boolean) => {
    this.isOpenNewCategoryModal = isOpen;
  };

  reset() {
    this.categories = [];
  }
}

export const categoriesStore = new CategoriesStore();
