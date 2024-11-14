import {makeAutoObservable} from 'mobx';
import {locationApi} from '@/api/locations/locations';
import {IAddEditLocation, ILocation} from '@/api/locations/types';
import {addNotification} from '@/utils';

class LocationsStore {
  isOpenAddEditLocationModal = false;
  singleLocation: ILocation | null = null;
  pageNumber = 1;
  pageSize = 10;
  name: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addLocation = (params: IAddEditLocation) =>
    locationApi.addLocation(params)
      .then(res => {
        addNotification('Успешно добавлена ​​новая локаци');

        return res;
      })
      .catch(addNotification);

  updateLocation = (params: IAddEditLocation) =>
    locationApi.updateLocation(params)
      .then(res => {
        addNotification('Успешно изменено локаци');

        return res;
      })
      .catch(addNotification);

  deleteLocation = (id: string) =>
    locationApi.deleteLocation(id)
      .then(res => {
        addNotification('Успешный локаци удаления');

        return res;
      })
      .catch(addNotification);

  setIsOpenAddEditLocationModal = (isOpen: boolean) => {
    this.isOpenAddEditLocationModal = isOpen;
  };

  setSingleLocation = (singleLocation: ILocation | null) => {
    this.singleLocation = singleLocation;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setName = (name: string) => {
    this.name = name;
  };

  reset() {
    this.isOpenAddEditLocationModal = false;
  }
}

export const locationsStore = new LocationsStore();
