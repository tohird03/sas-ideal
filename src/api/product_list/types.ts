import {ICategories} from '../categories/types';
import {IDirection} from '../direction/types';
import {IExpenseType} from '../expenseType/type';
import {IModel} from '../model/types';
import {IPromotionProducts} from '../promotion/types';
import {IProviderList} from '../provider/types';
import {IPagination, IProductStatus} from '../types';

export interface IProductList {
  id: string;
  name: string;
  category: ICategories;
  price: number;
  minPrice: number;
  maxPrice: number;
  quantity: number;
  count?: number;
  countDay?: number;
  status?: IProductStatus;
  images: any[];
  model: IModel;
  provider: IProviderList;
  productStatus?: {
    id: string;
    name: string;
  };
  cartId?: string;
  tissue: {
    id: string;
    name: string;
    hexColor: string;
    tissue: {
      id: string;
      name: string;
    };
  };
  tissueColor?: {
    id: string;
    name: string;
    hexColor: string;
    tissue: {
      id: string;
      name: string;
    };
  };
  direction: IDirection;
  oldPriceFactor?: OldPriceFactor;
  requestsProductId?: string;
  spends: IExpense[];
  promotion: IPromotionProducts[];
}

export interface IExpense {
  id: string;
  spend: number;
  spendType: IExpenseType;
  description: string;
}

export interface OldPriceFactor {
  id: string;
  allowableSale: number;
  b2b: number;
  costPrice: number;
  factoryPrice: number;
  fixForSeller: number;
  investorPrice: number;
  retailPrice: number;
  sale: number;
  savedPercent: number;
  sellerPercent: number;
}

export interface IProductListData {
  count: number;
  productList: IProductList[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IProductListParams extends IPagination {
  name?: string;
  categoryId?: string;
  modelId?: string;
  modelName?: string;
  tissueId?: string;
  tissueColorId?: string;
  providerId?: string;
  directionId?: string;
}

export interface IProductAdd {
  id?: string;
  name: string;
  quantity?: number;
  price: number;
  modelId: string;
  categoryId: string;
  images: any[];
  providerId: string;
  countDay: number;
  directionId?: string;
  tissueId: string;
  tissueColorId: string;
  costPrice: number;
  investorPrice: number;
  retailPrice: number;
  b2b: number;
  factoryPrice: number;
}

export interface IProductEdit {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modelId: string;
  category: string;
  providerId: string;
  count: number;
}

export interface IProductWorkOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  direction: string | null;
  category: {
    id: string;
    title: string;
  };
  providerId: {
    id: string;
    name: string;
  };
  model?: {
    id: string;
    name: string;
  };
  bases: IBasesWorkOn[];
  combinations?: ICombinationProducts[];
  processes?: [null];
  connectedProducts?: IConnectedProducts[];
  tissueColor?: {
    id: string;
    name: string;
    hexColor: string;
    tissue: {
      id: string;
      name: string;
    };
  };
}

export interface ICombinationProducts {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  baseId: string;
  processId: string;
  combinationId: string;
  status: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IConnectedProducts {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  category: {
    id: string;
    title: string;
  };
}

export interface IBasesWorkOn {
  id?: string;
  name: string;
  quantity?: number;
  images: string[];
}

export interface IProductUpdateWorkOn {
  productId?: string;
  productsToCreate?: ISelectedRowData[];
  productToUpdate?: string[];
  productsToDelete?: string[];
  imagesToCreate?: (string | undefined)[];
}

export interface IProcessUpdateProcesses {
  processId?: string;
  processesToConnect?: string[];
  processesToDisconnect?: string[];
}

export interface IBaseUpdateWorkOn {
  baseId?: string;
  basesToCreate?: ISelectedRowData[];
  basesToDelete?: string[];
}

export interface ICombinationWorkOn {
  combinationId?: string;
  combinationsToConnect?: string[];
  combinationsToDisconnect?: string[];
}

export interface IProductImgUploadWorkOn {
  id?: string;
  images: (string | undefined)[];
}

export interface ISelectedRowData {
  id: string;
  quantity: number;
}

export interface IOptionType {
  id: string;
  name: string;
}

export interface IDirections {
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  count: number;
  directionList: IOneDirection[];
}

export interface IOneDirection {
  id: string;
  title: string;
}

export interface IProductDirectionParams {
  pageSize: number;
  pageNumber: number;
}


export interface IPmsProductSellerPercentBulkUpdateParams {
  products: string[];
  percent: number;
}
