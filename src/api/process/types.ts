export interface IProcess {
  id: string;
  description: string;
  unitAmount: string;
  time: string;
  cost: number;
  unit: IProcessUnit;
}

export interface IGetProcess {
  pageCount: number;
  pageSize: number;
  description: string;
  count: number;
  pageNumber: number;
  processList: IProcess[];
}

export interface IAddProcess {
  description: string;
  time: string;
  cost: number;
  unitId: string;
  unitAmount: string;
  id?: string;
}

export interface IProcessUnit {
  id: string;
  name: string;
}

export interface IGetProcessUnit {
  unitList: IProcessUnit[];
}
