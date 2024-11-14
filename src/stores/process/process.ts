import {makeAutoObservable} from 'mobx';
import {processApi} from '@/api/process/process';
import {IAddProcess, IProcess, IProcessUnit} from '@/api/process/types';
import {IPagination} from '@/api/types';
import {addNotification} from '@/utils';

class ProcessStore {
  process: IProcess[] = [];
  totalProcess = 0;
  pageNumber = 1;
  count = 1;
  pageSize = 10;
  search = '';
  singleProcess: IProcess | null = null;
  isOpenAddNewProcessModal = false;
  processUnit: IProcessUnit[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getProcess = (params: IPagination) =>
    processApi.getProcess(params)
      .then(res => {
        if (res) {
          this.setProcess(res?.processList);
          this.setTotalProcess(res?.count);
        }

        return res;
      })
      .catch(addNotification);

  addProcess = (params: IAddProcess) =>
    processApi.addProcess(params)
      .then(res => {
        addNotification('Успешно добавлен новый процесс');

        return res;
      })
      .catch(addNotification);

  updateProcess = (params: IAddProcess) =>
    processApi.updateProcess(params)
      .then(res => {
        addNotification('Успешный процесс обновления');

        return res;
      })
      .catch(addNotification);

  getProcessUnit = () =>
    processApi.getProcessUnit()
      .then(res => {
        this.setUnit(res?.unitList);

        return res;
      })
      .catch(addNotification);

  deleteProcess = (id: string) =>
    processApi.deleteProcess(id)
      .then(res => {
        addNotification('Успешный процесс удаления');

        return res;
      })
      .catch(addNotification);

  setProcess = (process: IProcess[]) => {
    this.process = process;
  };

  setTotalProcess = (totalProcess: number) => {
    this.totalProcess = totalProcess;
  };

  setUnit = (unit: IProcessUnit[]) => {
    this.processUnit = unit;
  };

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setSingleProcess = (singleProcess: IProcess | null) => {
    this.singleProcess = singleProcess;
  };

  setIsOpenNewProcessModal = (isOpen: boolean) => {
    this.isOpenAddNewProcessModal = isOpen;
  };

  reset() {
    this.process = [];
  }
}

export const processStore = new ProcessStore();
