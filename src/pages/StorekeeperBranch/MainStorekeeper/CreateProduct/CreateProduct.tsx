import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {DataTable} from '@/components/Datatable/datatable';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {productListStore} from '@/stores/product_list/product_list';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ChangeStatusModal} from './ChangeStatusModal';
import {mainStorekeeperProductListColumns} from './constants';
import {Filter} from './Filter';

export const CreateProduct = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: productListData, isLoading: loading} = useQuery({
    queryKey: [
      'getProductList',
      mainStorekeeperStore.createProductPageSize,
      mainStorekeeperStore.createProductPageNumber,
      mainStorekeeperStore.filterCreateProductProductName,
      mainStorekeeperStore.filterCreateProductProductModelName,
      mainStorekeeperStore.filterCreateProductCategory,
      mainStorekeeperStore.filterCreateProductModel,
      mainStorekeeperStore.filterCreateProductTissue,
      mainStorekeeperStore.filterCreateProductTissueColor,
      mainStorekeeperStore.filterCreateProductProvider,
      mainStorekeeperStore.filterCreateProductDirection,
    ],
    queryFn: () =>
      productListStore.getProductList({
        pageSize: mainStorekeeperStore.createProductPageSize,
        pageNumber: mainStorekeeperStore.createProductPageNumber,
        name: mainStorekeeperStore.filterCreateProductProductName!,
        modelName: mainStorekeeperStore.filterCreateProductProductModelName!,
        categoryId: mainStorekeeperStore.filterCreateProductCategory!,
        modelId: mainStorekeeperStore.filterCreateProductModel!,
        tissueId: mainStorekeeperStore.filterCreateProductTissue!,
        tissueColorId: mainStorekeeperStore.filterCreateProductTissueColor!,
        providerId: mainStorekeeperStore.filterCreateProductProvider!,
        directionId: mainStorekeeperStore.filterCreateProductDirection!,
      }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    mainStorekeeperStore.setCreateProductPageSize(pageSize!);
    mainStorekeeperStore.setCreateProductPageNumber(page);
  };

  return (
    <>
      <Filter />
      <DataTable
        loading={loading}
        columns={mainStorekeeperProductListColumns}
        data={productListData?.productList || []}
        isMobile={isMobile}
        pagination={{
          total: productListData?.count,
          current: productListData?.pageNumber,
          pageSize: productListData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(productListData?.count),
        }}
      />

      {mainStorekeeperStore.isOpenChangeStatusCreateProduct && <ChangeStatusModal />}
    </>
  );
});
