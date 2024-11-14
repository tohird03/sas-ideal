import {makeAutoObservable} from 'mobx';
import {IProductList} from '@/api/product_list/types';
import {IPromotion, IPromotionProductListParams, IPromotionProducts} from '@/api/promotion/types';

class PromotionStore {
  pageNumber = 1;
  pageSize = 10;
  title: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  isOpenAddEditPromotion = false;
  singlePromotion: IPromotion | null = null;
  isOpenAddProductModal = false;
  isOpenPromotionValueModal = false;
  promotionProducts: IProductList[] = [];
  prmotionUpdateProducts: IPromotionProducts[] | null = null;
  promotionProductUpdateSelectedProductsKeys: React.Key[] = [];
  oldAddProductList: IProductList[] = [];

  promotionProductPageNumber = 1;
  promotionProductPageSize = 10;
  promotionProductName: string | null = null;
  isOpenSinglePromotionProductsFilter = false;
  promotionProductFilter: IPromotionProductListParams | null = null;

  promotionAddPmsProductPageNumber = 1;
  promotionAddPmsProductPageSize = 10;
  promotionAddPmsProductName: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
  };

  setPageSize = (limit: number) => {
    this.pageSize = limit;
  };

  setTitle = (title: string | null) => {
    this.title = title;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  setIsOpenAddEditPromotion = (isOpen: boolean) => {
    this.isOpenAddEditPromotion = isOpen;
  };

  setSinglePromotion = (singlePromotion: IPromotion | null) => {
    this.singlePromotion = singlePromotion;
  };

  setIsOpenAddProductModal = (isOpenAddProductModal: boolean) => {
    this.isOpenAddProductModal = isOpenAddProductModal;
  };

  setIsOpenPromotionValueModal = (isOpen: boolean) => {
    this.isOpenPromotionValueModal = isOpen;
  };

  setPromotionProducts = (promotionProducts: IProductList[]) => {
    this.promotionProducts = promotionProducts;
  };

  setPrmotionUpdateProducts = (prmotionUpdateProducts: IPromotionProducts[] | null) => {
    this.prmotionUpdateProducts = prmotionUpdateProducts;
  };

  setPromotionProductUpdateSelectedProductsKeys = (promotionProductUpdateSelectedProductsKeys: React.Key[]) => {
    this.promotionProductUpdateSelectedProductsKeys = promotionProductUpdateSelectedProductsKeys;
  };

  setOldAddProductList = (productList: IProductList[]) => {
    this.oldAddProductList = productList;
  };

  setPromotionProductPageNumber = (pageNumber: number) => {
    this.promotionProductPageNumber = pageNumber;
  };

  setPromotionProductPageSize = (pageSize: number) => {
    this.promotionProductPageSize = pageSize;
  };

  setPromotionProductName = (name: string | null) => {
    this.promotionProductName = name;
  };

  setIsOpenSinglePromotionProductsFilter = (isOpen: boolean) => {
    this.isOpenSinglePromotionProductsFilter = isOpen;
  };

  setPromotionAddPmsProductPageNumber = (promotionAddPmsProductPageNumber: number) => {
    this.promotionAddPmsProductPageNumber = promotionAddPmsProductPageNumber;
  };

  setPromotionAddPmsProductPageSize = (promotionAddPmsProductPageSize: number) => {
    this.promotionAddPmsProductPageSize = promotionAddPmsProductPageSize;
  };

  setPromotionAddPmsProductName = (promotionAddPmsProductName: string | null) => {
    this.promotionAddPmsProductName = promotionAddPmsProductName;
  };

  setPromotionProductFilter = (promotionProductFilter: IPromotionProductListParams | null) => {
    this.promotionProductFilter = promotionProductFilter;
  };

  reset() {
    this.pageNumber = 1;
  }
}

export const promotionStore = new PromotionStore();
