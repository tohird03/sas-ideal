import {makeAutoObservable} from 'mobx';
import {myTasksApi} from '@/api/myLogs/myLogs';
import {IMyLogId, IMyLogs, IMyLogsParams} from '@/api/myLogs/types';
import {addNotification} from '@/utils';

class MyLogsStore {
  myLogs: IMyLogs[] = [];
  totalMyLogs = 0;
  page = 1;
  limit = 10;
  sellerName = '';
  modelName = '';
  date = 'asc';

  constructor() {
    makeAutoObservable(this);
  }

  getTasks = (params: IMyLogsParams) =>
    myTasksApi.getTasks(params)
      .then(res => {
        if (res) {
          this.setMyLogs(res?.taskList);
          this.setTotal(res?.count);
        }

        return res;
      })
      .catch(addNotification);

  getTaskId = (params: string) =>
    myTasksApi.getTaskId(params)
      .then(res => res)
      .catch(addNotification);


  setMyLogs = (myLogs: IMyLogs[]) => {
    this.myLogs = myLogs;
  };

  setTotal = (total: number) => {
    this.totalMyLogs = total;
  };

  setPage = (page: number) => {
    this.page = page;
  };

  setLimit = (limit: number) => {
    this.limit = limit;
  };

  setSellerSearch = (sellerName: string) => {
    this.sellerName = sellerName;
  };

  setModelName = (modelName: string) => {
    this.modelName = modelName;
  };

  setDate = (date: string) => {
    this.date = date;
  };

  reset() {
    this.myLogs = [];
  }
}

export const myLogsStore = new MyLogsStore();
