import {makeAutoObservable} from 'mobx';
import {productApi} from '@/api/product_list/product_list';
import {
  IBaseUpdateWorkOn,
  ICombinationWorkOn,
  IOneDirection,
  IProcessUpdateProcesses,
  IProductDirectionParams,
  IProductImgUploadWorkOn,
  IProductList,
  IProductListParams,
  IProductUpdateWorkOn,
  IProductWorkOn,
  ISelectedRowData,
} from '@/api/product_list/types';
import {IPmsAddProduct, IPmsProductFilter} from '@/api/productmanager/tyes';
import {addNotification} from '../../utils/addNotification';

class ProductListStore {
  [x: string]: any;
  pageSize = 10;
  pageNumber = 1;
  search = '';
  categoryFilter = '';
  modelFilter = '';
  isOpenProductModal = false;
  isOpenFileModal = false;
  isMoreOpenModal = false;
  isProductListTabIndex = 'История заказов';
  editProductList: IProductList | null = null;
  productId: string | null = null;
  productIdData: IProductWorkOn | null = null;
  isOpenProductImdUploadModal = false;
  selectedCategory: string | null = null;
  selectedRowdata: ISelectedRowData[] = [];
  selectBasesRowData: ISelectedRowData[] = [];
  allDirections: IOneDirection[] = [];
  isOpenPmsProductFilterModal = false;
  filterParams: IPmsProductFilter | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getAllDirections = (params: IProductDirectionParams) =>
    productApi
      .getAllDirection(params)
      .then((res) => {
        this.setAllDirections(res.directionList);

        return res;
      })
      .catch(addNotification);

  getProdIdData = (id: string) =>
    productApi
      .getProductListId(id)
      .then((res) => {
        this.setProductIdData(res);

        return res;
      })
      .catch(addNotification);

  getProductList = (params: IProductListParams) =>
    productApi
      .getProductList(params)
      .then((res) => res)
      .catch(addNotification);

  postProductList = (params: IPmsAddProduct) =>
    productApi.postProductList(params);

  postPmsProductList = (params: IPmsAddProduct) =>
    productApi.postPmsProductList(params);

  patchProductList = (params: IPmsAddProduct) =>
    productApi.patchProductList(params)
      .catch(addNotification);


  deleteProductList = (id: string) =>
    productApi
      .deleteProductList(id)
      .then((res) => {
        if (res?.status === 204) {
          addNotification('Продукт успешна удалено');
        }
      })
      .catch(addNotification);

  patchProductUpdateWorkOn = (params: IProductUpdateWorkOn) =>
    productApi
      .patchProductWorkOn(params)
      .then(() => {
        addNotification('Обновление продукта');
      })
      .catch(addNotification);

  patchProcessesUpdateWorkOn = (params: IProcessUpdateProcesses) =>
    productApi
      .patchProcessWorkOn(params)
      .then(() => {
        addNotification('Обновление процессов');
      })
      .catch(addNotification);

  patchBaseUpdateWorkOn = (params: IBaseUpdateWorkOn) =>
    productApi
      .patchBasesWorkOn(params)
      .then((res) => {
        addNotification('Обновление База');

        return res;
      })
      .catch(addNotification);

  patchCombinationUpdateWorkOn = (params: ICombinationWorkOn) =>
    productApi
      .patchCombinationWorkOn(params)
      .then(() => {
        addNotification('Обновление База');
      })
      .catch(addNotification);

  patchProductImgUploadWorkOn = (params: IProductImgUploadWorkOn) =>
    productApi
      .patchProductImgUploadWorkOn(params)
      .then(() => {
        addNotification('Обновление изображение');
      })
      .catch(addNotification);

  setIsOpenProductUploadImgModal = (isOpen: boolean) => {
    this.isOpenProductImdUploadModal = isOpen;
  };

  setSelectedCategory = (category: string | null) => {
    this.selectedCategory = category;
  };

  setEditProduct = (editProduct: IProductList | null) => {
    this.editProductList = editProduct;
  };

  setProductIdData = (productIdData: IProductWorkOn | null) => {
    this.productIdData = productIdData;
  };

  setIsOpenProductModal = (isOpen: boolean) => {
    this.isOpenProductModal = isOpen;
  };
  setIsOpenFileModal = (isOpen: boolean) => {
    this.isOpenFileModal = isOpen;
  };

  setIsMoreOpenModal = (isOpen: boolean) => {
    this.isMoreOpenModal = isOpen;
  };

  setIsProductListTabIndex = (isTabs: string) => {
    this.isProductListTabIndex = isTabs;
  };

  setSearch = (search: string) => {
    this.search = search;
  };

  setCategoryFilter = (category: string) => {
    this.categoryFilter = category;
  };

  setModelFilter = (model: string) => {
    this.modelFilter = model;
  };

  setProductId = (productId: string | null) => {
    this.productId = productId;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setSelectedRowData = (rowData: ISelectedRowData[]) => {
    this.selectedRowdata = rowData;
  };

  setSelectBasesRowData = (rowData: ISelectedRowData[]) => {
    this.selectBasesRowData = rowData;
  };

  setAllDirections = (directions: IOneDirection[]) => {
    this.allDirections = directions;
  };

  setIsOpenPmsProductFilterModal = (open: boolean) => {
    this.isOpenPmsProductFilterModal = open;
  };

  setFilterParams = (params: IPmsProductFilter | null) => {
    this.filterParams = params;
  };
}

export const productListStore = new ProductListStore();
