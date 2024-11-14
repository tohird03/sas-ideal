import {IProductList} from '@/api/product_list/types';
import {IPagination} from '@/api/types';

export interface IGetSellerNewProductParams extends IPagination {
  warehouseId?: string;
  providerId?: string;
  categoryId?: string;
  productId?: string;
  modelId?: string;
  name?: string;
  directionId?: string;
  tissueId?: string;
  tissueColorId?: string;
}


export interface IGetSellerNewProducts {
  count: number;
  productList: IProductList[];
}
