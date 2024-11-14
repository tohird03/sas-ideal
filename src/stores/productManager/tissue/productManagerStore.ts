import {makeAutoObservable} from 'mobx';
import {IProductList} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {
  IGetCategoryManagerPricing,
  IGetManagerTissueList,
  IGetManagerTissueParams,
  IPatchManagerTissue,
  IPostManagerTissue,
  IProductManagerTabStatus,
  IProductMinPrice,
} from '@/api/productmanager/tyes';
import {addNotification} from '@/utils';

class ProductManagerStore {
  pageSize = 10;
  pageNumber = 1;

  productManagerMainTabKey = IProductManagerTabStatus.Product;
  productManagerMainSelectedProduct: IProductList[] | null = null;
  isProductManagerMainSelectedProductModal = false;
  isProductManagerMainFactorsheetModal = false;
  isProductSetsAddProductModal = false;
  isAddProductSetModal = false;
  setsProductCount = 0;
  isProductManagerPricingModal = false;
  isProductManagerPricingSingle: IGetCategoryManagerPricing[] | null = null;

  filter = '';
  isOpenTissueAddEditModal = false;
  isEditTissueProduct: IPatchManagerTissue | null = null;
  searchProduct = '';
  isOpenTissueColorAddEditModal = false;
  isEditTissueColorProduct: IGetManagerTissueList | null = null;
  isProductAddManagerModal = false;

  createProductMinPrice = 0;
  isOpenCreateProductMinPriceModal = false;
  createAddEditProductMinPriceSpends: IProductMinPrice[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getTissue = (params: IGetManagerTissueParams) =>
    productManagerApi.getTissue(params)
      .then((res) => res)
      .catch(addNotification);

  postTissue = (params: IPostManagerTissue) =>
    productManagerApi.postTissue(params)
      .then((res) => {
        addNotification('Успешно добавлен новый ткань');

        return res;
      })
      .catch(addNotification);

  patchTissue = (params: IPatchManagerTissue) =>
    productManagerApi.patchTissue(params)
      .then((res) => {
        addNotification('Успешно измененный ткань');

        return res;
      })
      .catch(addNotification);

  deleteTissue = (id: string) =>
    productManagerApi.deleteTissue(id);


  getColorByTissue = (id: string) =>
    productManagerApi.getColorByTissue(id)
      .then((res) => res)
      .catch(addNotification);

  postColorByTissue = (params: IGetManagerTissueList) =>
    productManagerApi.postColorByTissue(params)
      .then((res) => {
        addNotification('Успешно добавлен новый ткань цвет');

        return res;
      })
      .catch(addNotification);

  patchColorByTissue = (params: IGetManagerTissueList) =>
    productManagerApi.patchColorByTissue(params)
      .then((res) => {
        addNotification('Успешно измененный ткань цвет');

        return res;
      })
      .catch(addNotification);

  deleteColorByTissue = (id: string) =>
    productManagerApi.deleteColorByTissue(id);

  setIsOpenTissueColorAddEditModal = (isOpen: boolean) => {
    this.isOpenTissueColorAddEditModal = isOpen;
  };
  setFilter = (filter: string) => {
    this.filter = filter;
  };

  setIsProductManagerModal = (isOpen: boolean) => {
    this.isProductAddManagerModal = isOpen;
  };

  setPageNumber = (number: number) => {
    this.pageNumber = number;
  };

  setPageSize = (size: number) => {
    this.pageSize = size;
  };

  setIsOpenTissueAddEditModal = (isOpen: boolean) => {
    this.isOpenTissueAddEditModal = isOpen;
  };

  setIsEditTissueProduct = (isEdit: IPatchManagerTissue | null) => {
    this.isEditTissueProduct = isEdit;
  };
  setIsEditTissueColorProduct = (isEdit: IGetManagerTissueList | null) => {
    this.isEditTissueColorProduct = isEdit;
  };

  setIsProductManagerMainTabKey = (tabKey: IProductManagerTabStatus) => {
    this.productManagerMainTabKey = tabKey;
  };

  setIsProductManagerMainSelectedProduct = (selectedProduct: IProductList[]) => {
    this.productManagerMainSelectedProduct = selectedProduct;
  };

  setIsProductManagerSelectedProductModal = (isOpen: boolean) => {
    this.isProductManagerMainSelectedProductModal = isOpen;
  };

  setIsProductManagerMainFactorsheetModal = (isOpen: boolean) => {
    this.isProductManagerMainFactorsheetModal= isOpen;
  };

  setIsProductSetsAddProductModal = (isOpen: boolean) => {
    this.isProductSetsAddProductModal = isOpen;
  };

  setIsAddProductSetModal = (isAdd: boolean) => {
    this.isAddProductSetModal = isAdd;
  };

  setSetsProductCount = (count: number) => {
    this.setsProductCount = count;
  };

  setIsProductManagerPricingModal = (isOpen: boolean) => {
    this.isProductManagerPricingModal = isOpen;
  };

  setIsProductManagerPricingSingle = (singlePricingProduct: IGetCategoryManagerPricing[] | null) => {
    this.isProductManagerPricingSingle = singlePricingProduct;
  };

  setCreateProductMinPrice = (createProductMinPrice: number) => {
    this.createProductMinPrice = createProductMinPrice;
  };

  setIsOpenCreateProductMinPriceModal = (isOpenCreateProductMinPriceModal: boolean) => {
    this.isOpenCreateProductMinPriceModal = isOpenCreateProductMinPriceModal;
  };

  setCreateAddEditProductMinPriceSpends = (createAddEditProductMinPriceSpends: IProductMinPrice[]) => {
    this.createAddEditProductMinPriceSpends = createAddEditProductMinPriceSpends;
  };
}

export const productManagerStore = new ProductManagerStore();
