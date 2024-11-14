import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {applyProductsStore} from '@/stores/provider';
import {useMediaQuery} from '@/utils/mediaQuery';
import {applyProductsColumns} from './constants';
import {Filter} from './Filter';
import {ProductStatusChangeModal} from './StatusChangeModal';

export const ApplyProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    applyProductsStore.setPageSize(pageSize!);
    applyProductsStore.setPageNumber(page);
  };

  const {data: providerOrdersData, isLoading: applicationsDataLoading} =
    useQuery({
      queryKey: [
        'getProviderOrders',
        applyProductsStore.pageNumber,
        applyProductsStore.pageSize,
        applyProductsStore.productStatusFilterTab,
      ],
      queryFn: () => warehouseOrdersApi.getProviderOrders({
        pageNumber: applyProductsStore.pageNumber,
        pageSize: applyProductsStore.pageSize,
        filter: applyProductsStore.filter,
        flag: applyProductsStore?.productStatusFilterTab !== IProductStatus.ALL
          ? applyProductsStore?.productStatusFilterTab
          : null!,
      }),
    });


  return (
    <>
      <Filter />
      <DataTable
        loading={applicationsDataLoading}
        data={providerOrdersData?.orderList || []}
        columns={applyProductsColumns}
        isMobile={isMobile}
        pagination={{
          total: providerOrdersData?.count,
          current: applyProductsStore?.pageNumber,
          pageSize: applyProductsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(providerOrdersData?.count),
        }}
      />

      {applyProductsStore.isOpenProductStatusChangeModal && <ProductStatusChangeModal />}
    </>
  );
});
