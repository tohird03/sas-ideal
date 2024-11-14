import {makeAutoObservable} from 'mobx';
import {basesApi} from '@/api/base/base';
import {IBase, IBaseAdd, IBaseEdit, IBaseParams} from '@/api/base/types';
import {addNotification} from '@/utils/addNotification';

class BasesStore {
  allBases: IBase[] = [];
  pageSize = 10;
  pageNumber = 1;
  name = '';
  search = '';
  searchBy = '';
  baseCategoryId: string | null = null;
  isOpenAddBaseModal = false;
  isOpenCompaniesModal = false;
  isOpenEditModal = false;
  editBase: IBase | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getBases = (params: IBaseParams) =>
    basesApi.getBases(params)
      .then((res) => {
        if (res) {
          this.setAllBases(res?.baseList);
        }

        return res;
      })
      .catch(addNotification);

  setAllBases = (bases: IBase[]) => {
    this.allBases = bases;
  };

  postBases = (params: IBaseAdd) =>
    basesApi.postBases(params)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('Успешно добавлено нового база');
        }

        return res;
      })
      .catch(addNotification);

  deleteBases = (id: string) =>
    basesApi.deleteBase(id)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('База успешна удалено');

        }
      })
      .catch(addNotification);

  editBases = (id: string, params: IBaseEdit) =>
    basesApi.editBase(id, params)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('База успешна изменено');
        }
      })
      .catch(addNotification);

  pmsUnitGet = () =>
    basesApi.getBaseUnit()
      .then((res) => res)
      .catch(addNotification);

  baseCategoryGet = () =>
    basesApi.getBaseCategory()
      .then((res) => res)
      .catch(addNotification);


  setEditBase = (base: IBase) => {
    this.editBase = base;
  };

  setPageSize = (pageSize: any) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: any) => {
    this.pageNumber = pageNumber;
  };

  setName = (name: any) => {
    this.name = name;
  };

  setBaseCategoryId = (id: string) => {
    this.baseCategoryId = id;
  };

  setIsOpenAddBaseModal = (isOpen: boolean) => {
    this.isOpenAddBaseModal = isOpen;
  };

  setIsOpenEditModal = (isEdit: boolean) => {
    this.isOpenEditModal = isEdit;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setSearchBy = (searchBy: string) => {
    this.searchBy = searchBy;
  };

  reset() {
    this.allBases = [];
  }
}

export const basesStore = new BasesStore();
