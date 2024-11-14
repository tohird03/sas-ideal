import {makeAutoObservable} from 'mobx';
import {IExpenseType} from '@/api/expenseType/type';

class PmExpenseStore {
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;
  singleExpenseType: IExpenseType | null = null;
  isOpenAddEditExpenseModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setName = (name: string) => {
    this.name = name;
  };

  setSingleExpenseType = (singleExpenseType: IExpenseType | null) => {
    this.singleExpenseType = singleExpenseType;
  };

  setIsOpenAddEditExpenseModal = (isOpen: boolean) => {
    this.isOpenAddEditExpenseModal = isOpen;
  };

  reset() {
    this.isOpenAddEditExpenseModal = false;
  }
}

export const pmExpenseStore = new PmExpenseStore();
