import {makeAutoObservable} from 'mobx';
import {IGetMainStProductParams, IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {IProductList} from '@/api/product_list/types';
import {IGetSellerNewProductParams} from '@/api/seller/sellerProducts/types';

class SellerProductsStore {
  warehouseProductPageNumber = 1;
  warehouseProductPageSize = 10;
  warehouseProductName: string | null = null;
  warehouseProductFilterValues: IGetMainStProductParams | null = null;
  isOpenWarehouseProductFilterModal = false;
  isOpenSaveToBasketWarehouseProductModal = false;
  singleWarehouseProducts: IMainStorekeeperProductList | null = null;

  newProductPageNumber = 1;
  newProductPageSize = 10;
  newProductName: string | null = null;
  isOpenSaveToBasketNewProductModal = false;
  singleNewProduct: IProductList | null = null;
  isOpenNewProductFilterModal = false;
  newProductFilterValues: IGetSellerNewProductParams | null = null;

  isOpenSellerFilterModal = false;

  printProductPageNumber = 1;
  printProductPageSize = 10;
  printProductName: string | null = null;
  isOpenPrintProductFilterModal = false;
  printProductFilter: IGetSellerNewProductParams | null = null;
  isOpenPrintProductModal = false;
  singlePrintProduct: IProductList | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setWarehouseProductPageNumber = (pageNumber: number) => {
    this.warehouseProductPageNumber = pageNumber;
  };

  setWarehouseProductPageSize = (pageSize: number) => {
    this.warehouseProductPageSize = pageSize;
  };

  setWarehouseProductName = (warehouseProductName: string | null) => {
    this.warehouseProductName = warehouseProductName;
  };

  setWarehouseProductFilterValues = (warehouseProductFilterValues: IGetMainStProductParams | null) => {
    this.warehouseProductFilterValues = warehouseProductFilterValues;
  };

  setIsOpenWarehouseProductFilterModal = (isOpen: boolean) => {
    this.isOpenWarehouseProductFilterModal = isOpen;
  };

  setIsOpenSaveToBasketWarehouseProductModal = (isOpen: boolean) => {
    this.isOpenSaveToBasketWarehouseProductModal = isOpen;
  };

  setSingleWarehouseProducts = (singleWarehouseProducts: IMainStorekeeperProductList | null) => {
    this.singleWarehouseProducts = singleWarehouseProducts;
  };

  setNewProductPageNumber = (pageNumber: number) => {
    this.newProductPageNumber = pageNumber;
  };

  setNewProductPageSize = (pageSize: number) => {
    this.newProductPageSize = pageSize;
  };

  setNewProductName = (productName: string | null) => {
    this.newProductName = productName;
  };

  setIsOpenSaveToBasketNewProductModal = (isOpen: boolean) => {
    this.isOpenSaveToBasketNewProductModal = isOpen;
  };

  setSingleNewProduct = (singleNewProduct: IProductList | null) => {
    this.singleNewProduct = singleNewProduct;
  };

  setIsOpenSellerFilterModal = (isOpen: boolean) => {
    this.isOpenSellerFilterModal = isOpen;
  };

  setIsOpenNewProductFilterModal = (isOpen: boolean) => {
    this.isOpenNewProductFilterModal = isOpen;
  };

  setNewProductFilterValues = (newProductFilterValues: IGetSellerNewProductParams | null) => {
    this.newProductFilterValues = newProductFilterValues;
  };


  setPrintProductPageNumber = (pageNumber: number) => {
    this.printProductPageNumber = pageNumber;
  };

  setPrintProductPageSize = (pageSize: number) => {
    this.printProductPageSize = pageSize;
  };

  setPrintProductName = (productName: string | null) => {
    this.printProductName = productName;
  };

  setIsOpenPrintProductFilterModal = (isOpen: boolean) => {
    this.isOpenPrintProductFilterModal = isOpen;
  };

  setPrintProductFilter = (printProductFilter: IGetSellerNewProductParams | null) => {
    this.printProductFilter = printProductFilter;
  };

  setIsOpenPrintProductModal = (isOpen: boolean) => {
    this.isOpenPrintProductModal = isOpen;
  };

  setSinglePrintProduct = (singlePrintProduct: IProductList | null) => {
    this.singlePrintProduct = singlePrintProduct;
  };

  reset() {
    this.warehouseProductPageNumber = 1;
    this.warehouseProductPageSize = 10;
    this.warehouseProductFilterValues = null;
    this.warehouseProductName = null;
    this.newProductPageNumber = 1;
    this.newProductPageSize = 10;
    this.newProductFilterValues = null;
    this.newProductName = null;
    this.printProductPageNumber = 1;
    this.printProductPageSize = 10;
    this.printProductFilter = null;
    this.printProductName = null;
  }
}

export const sellerProductStore = new SellerProductsStore();
