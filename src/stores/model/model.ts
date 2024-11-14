import {makeAutoObservable} from 'mobx';
import {modelApi} from '@/api/model/model';
import {IAddModel, IModel, IModelParams} from '@/api/model/types';
import {addNotification} from '@/utils';

class ModelStore {
  models: IModel[] = [];
  totalModels = 0;
  page = 1;
  limit = 10;
  search = '';
  singleModel: IModel | null = null;
  isOpenNewModel = false;
  searchBy: string | null = null;
  modelCategoryId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getModel = (params: IModelParams) =>
    modelApi.getProcess(params)
      .then(res => {
        if (res) {
          this.setModel(res?.modelList);
          this.setTotalModel(res?.count);
        }

        return res;
      })
      .catch(addNotification);

  getModelSelect = () =>
    modelApi.getModelSelect()
      .then(res => res)
      .catch(addNotification);

  addModel = (params: IAddModel) =>
    modelApi.addModel(params)
      .then(res => {
        addNotification('Успешно добавлена ​​новая модель');

        return res;
      })
      .catch(addNotification);

  updateModel = (params: IAddModel) =>
    modelApi.updateModel(params)
      .then(res => {
        addNotification('Успешно добавлена ​​новая модель');

        return res;
      })
      .catch(addNotification);

  deleteModel = (id: string) =>
    modelApi.deleteModel(id)
      .then(res => {
        addNotification('Успешный модель удаления');

        return res;
      })
      .catch(addNotification);

  setModelCategoryId = (id: string) => {
    this.modelCategoryId = id;
  };

  setModel = (model: IModel[]) => {
    this.models = model;
  };

  setTotalModel = (total: number) => {
    this.totalModels = total;
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

  setSingleModel = (singleModel: IModel | null) => {
    this.singleModel = singleModel;
  };

  setIsOpenNewModel = (isOpen: boolean) => {
    this.isOpenNewModel = isOpen;
  };

  setSearchBy = (searchBy: string | null) => {
    this.searchBy = searchBy;
  };

  reset() {
    this.models = [];
  }
}

export const modelStore = new ModelStore();
