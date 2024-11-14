import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {sellerProductsApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {sellerProductStore} from '@/stores/seller';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {newProductsColumns} from './constants';
import {Filter} from './Filter';
import {ProductFilterModal} from './ProductFilterModal';
import {SaveToBasketModal} from './SaveToBasketModal';

export const NewProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: sellerNewProductsData, isLoading: loading} = useQuery({
    queryKey: [
      'getNewProducts',
      sellerProductStore.newProductPageNumber,
      sellerProductStore.newProductPageSize,
      sellerProductStore.newProductName,
      sellerProductStore.newProductFilterValues,
    ],
    queryFn: () => sellerProductsApi.getSellerNewProducts({
      pageNumber: sellerProductStore.newProductPageNumber,
      pageSize: sellerProductStore.newProductPageSize,
      name: sellerProductStore.newProductName!,
      ...sellerProductStore.newProductFilterValues,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    sellerProductStore.setNewProductPageNumber(page);
    sellerProductStore.setNewProductPageSize(pageSize!);
  };

  return (
    <>
      <Filter />
      <DataTable
        columns={newProductsColumns}
        data={sellerNewProductsData?.productList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: sellerNewProductsData?.count,
          current: sellerProductStore?.newProductPageNumber,
          pageSize: sellerProductStore?.newProductPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(sellerNewProductsData?.count),
        }}
      />

      {sellerProductStore.isOpenNewProductFilterModal && <ProductFilterModal />}
      {sellerProductStore.isOpenSaveToBasketNewProductModal && <SaveToBasketModal />}
    </>
  );
});
