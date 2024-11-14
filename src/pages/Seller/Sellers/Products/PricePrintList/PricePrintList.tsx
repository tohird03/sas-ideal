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
import {PrintModal} from './PrintModal';
import {ProductFilterModal} from './ProductFilterModal';

export const ProductPrintList = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: sellerNewProductsData, isLoading: loading} = useQuery({
    queryKey: [
      'getNewProducts',
      sellerProductStore.printProductPageNumber,
      sellerProductStore.printProductPageSize,
      sellerProductStore.printProductName,
      sellerProductStore.printProductFilter,
    ],
    queryFn: () => sellerProductsApi.getSellerNewProducts({
      pageNumber: sellerProductStore.printProductPageNumber,
      pageSize: sellerProductStore.printProductPageSize,
      name: sellerProductStore.printProductName!,
      ...sellerProductStore.printProductFilter,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    sellerProductStore.setPrintProductPageNumber(page);
    sellerProductStore.setPrintProductPageSize(pageSize!);
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
          current: sellerProductStore?.printProductPageNumber,
          pageSize: sellerProductStore?.printProductPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(sellerNewProductsData?.count),
        }}
      />

      {sellerProductStore.isOpenPrintProductFilterModal && <ProductFilterModal />}
      {sellerProductStore.isOpenPrintProductModal && <PrintModal />}
    </>
  );
});
