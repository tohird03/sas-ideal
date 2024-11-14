import {IAddUser} from '@/api/users/types';

export interface IAddEditProviderForm extends IAddUser {
  warehouseName: string;
  location: string;
  warehouseTypeId: string;
  companyName: string;
}
