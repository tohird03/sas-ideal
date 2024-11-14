import {IPaymentType} from '@/api/paymentType/types';
import {IProductList} from '@/api/product_list/types';
import {IPagination} from '@/api/types';
import {IUser} from '@/api/users/types';
import {IClientFrom} from '../sellerClientFrom/types';
import {IAddVisitedClient, IClient} from '../sellerVisitedClients/types';

export interface IGetSellerBasketProductsParams {
  categoryId?: string;
}

export interface ISellerBasketProducts {
  quantity: number;
  product: IBasketProduct;
}

type RemovePromotionArrayProduct = Omit<IProductList, 'promotion'>;

export interface IBasketProduct extends RemovePromotionArrayProduct {
  partId: string;
  fromWarehouse: boolean;
  fixForSeller: number;
  promotion?: number;
}

export interface ISellerSalePayment {
  uzs: number;
  usd: number;
  rest: number;
  course: number;
  totalSum: number;
  description: string;
  paymentType: string;
  createdAt?: string;
}

export interface ISellerSaleClient extends IAddVisitedClient {
  clientId?: string;
  deliveryDate: Date;
  clientFrom: IClientFrom;
}

export interface ISellerProductSalePayments extends ISellerSalePayment {
  uzsByCourse?: number;
  id: number;
}

export interface ISellerAddProductToBasketParams {
  productId: string;
  quantity: number;
  partId: string;
  fromWarehouse: boolean;
  paymentType?: IPaymentType;
  wmsProductId?: string;
}

export interface ISaleProducts {
  clientInfo: ISellerSaleClient;
  payments: ISellerSalePayment[];
  products: ISellerSaleProduct[];
}

export interface ISellerSaleProduct {
  description?: string;
  finalPrice: number;
  price: number;
  quantity: number;
  sale: number;
  sellerPercent: number;
  fromWarehouse: boolean;
}

export interface IUpdateBasketProduct {
  productId: string;
  quantity: number;
  fixForSeller: number;
}
