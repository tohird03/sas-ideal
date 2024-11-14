import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {sellerProductStore} from '@/stores/seller';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {productInWarehouseColumns} from './constants';
import {Filter} from './Filter';
import {ProductFilterModal} from './ProductFilterModal';
import {SaveToBasketModal} from './SaveToBasketModal';

export const ProductInWarehouse = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: warehouseProductsData, isLoading: loading} = useQuery({
    queryKey: [
      'getMainStProduct',
      sellerProductStore.warehouseProductPageNumber,
      sellerProductStore.warehouseProductPageSize,
      sellerProductStore.warehouseProductName,
      sellerProductStore.warehouseProductFilterValues,
    ],
    queryFn: () => mainStorekeeperApi.getMainStProduct({
      pageNumber: sellerProductStore.warehouseProductPageNumber,
      pageSize: sellerProductStore.warehouseProductPageSize,
      name: sellerProductStore.warehouseProductName!,
      ...sellerProductStore.warehouseProductFilterValues,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    sellerProductStore.setWarehouseProductPageNumber(page);
    sellerProductStore.setWarehouseProductPageSize(pageSize!);
  };

  return (
    <>
      <Filter />
      <DataTable
        columns={productInWarehouseColumns}
        data={warehouseProductsData?.productList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: warehouseProductsData?.count,
          current: sellerProductStore?.warehouseProductPageNumber,
          pageSize: sellerProductStore?.warehouseProductPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(warehouseProductsData?.count),
        }}
      />

      {sellerProductStore.isOpenWarehouseProductFilterModal && <ProductFilterModal />}
      {sellerProductStore.isOpenSaveToBasketWarehouseProductModal && <SaveToBasketModal />}
    </>
  );
});
