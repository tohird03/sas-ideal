import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {applyProductsQaStore} from '@/stores/providerQA';
import {useMediaQuery} from '@/utils/mediaQuery';
import {applyProductsColumns} from './constants';
import {Filter} from './Filter';
import {ProductStatusChangeModal} from './StatusChangeModal';

export const ApplyProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    applyProductsQaStore.setPageSize(pageSize!);
    applyProductsQaStore.setPageNumber(page);
  };

  const {data: providerOrdersData, isLoading: applicationsDataLoading} =
    useQuery({
      queryKey: [
        'getProviderOrders',
        applyProductsQaStore.pageNumber,
        applyProductsQaStore.pageSize,
        applyProductsQaStore.productStatusFilterTab,
      ],
      queryFn: () => warehouseOrdersApi.getProviderOrders({
        pageNumber: applyProductsQaStore.pageNumber,
        pageSize: applyProductsQaStore.pageSize,
        filter: applyProductsQaStore.filter,
        flag: applyProductsQaStore?.productStatusFilterTab !== IProductStatus.ALL
          ? applyProductsQaStore?.productStatusFilterTab
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
          current: applyProductsQaStore?.pageNumber,
          pageSize: applyProductsQaStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(providerOrdersData?.count),
        }}
      />

      {applyProductsQaStore.isOpenProductStatusChangeModal && <ProductStatusChangeModal />}
    </>
  );
});
