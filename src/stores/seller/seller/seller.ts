import {makeAutoObservable} from 'mobx';
import {ISaleOrderProduct} from '@/api/orders/types';
import {ISellerBasketProducts, ISellerProductSalePayments} from '@/api/seller/sellerSaleAndOrder/types';

class SellerStore {
  isOpenSellerFilterModal = false;
  isOpenSellerPaymentModal = false;
  isOpenSellerClentInfoModal = false;
  isOpenBasketProductUpdateModal = false;
  isOpenOrderDetailsProductUpdateModal = false;

  sellerProductSalePayments: ISellerProductSalePayments[] = [];
  sellerSingleBasketModal: ISellerBasketProducts | null = null;
  sellerSingleOrderDetailsProduct: ISaleOrderProduct | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsOpenSellerFilterModal = (isOpen: boolean) => {
    this.isOpenSellerFilterModal = isOpen;
  };

  setIsOpenSellerPaymentModal = (isOpen: boolean) => {
    this.isOpenSellerPaymentModal = isOpen;
  };

  setIsOpenSellerClentInfoModal = (isOpen: boolean) => {
    this.isOpenSellerClentInfoModal = isOpen;
  };

  setIsOpenBasketProductUpdateModal = (isOpen: boolean) => {
    this.isOpenBasketProductUpdateModal = isOpen;
  };

  setSellerProductSalePayments = (sellerProductSalePayments: ISellerProductSalePayments[]) => {
    this.sellerProductSalePayments = sellerProductSalePayments;
  };

  setSellerSingleBasketModal = (sellerSingleBasketModal: ISellerBasketProducts | null) => {
    this.sellerSingleBasketModal = sellerSingleBasketModal;
  };

  setIsOpenOrderDetailsProductUpdateModal = (isOpenOrderDetailsProductUpdateModal: boolean) => {
    this.isOpenOrderDetailsProductUpdateModal = isOpenOrderDetailsProductUpdateModal;
  };

  setSellerSingleOrderDetailsProduct = (sellerSingleOrderDetailsProduct: ISaleOrderProduct | null) => {
    this.sellerSingleOrderDetailsProduct = sellerSingleOrderDetailsProduct;
  };
}

export const sellerStore = new SellerStore();
