import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {wmsProductsApi} from '@/api/wmsProducts';
import {IGetWmsProvidersStorekeeperProductsTypes} from '@/api/wmsProducts/types';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {relatedProductsStore} from '@/stores/provider/related-products/related-products';
import {useMediaQuery} from '@/utils/mediaQuery';
import {commonProductsColumns, moreProductsColumns} from './constants';
import {Filter} from './Filter';
import {UploadProductModal} from './UploadProductModal';

export const RelatedProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    relatedProductsStore.setPageSize(pageSize!);
    relatedProductsStore.setPageNumber(page);
  };

  const {data: storekeeperProductForProvider, isLoading: applicationsDataLoading} =
    useQuery({
      queryKey: [
        'getStorekeeperProductForProvider',
        relatedProductsStore.pageNumber,
        relatedProductsStore.pageSize,
        relatedProductsStore.productActiveTab,
      ],
      queryFn: () =>
        wmsProductsApi.getProvidersStorekeeperProducts({
          pageNumber: relatedProductsStore.pageNumber,
          pageSize: relatedProductsStore.pageSize,
          filter: relatedProductsStore.productActiveTab,
        }),
    });


  return (
    <>
      <Filter />
      <DataTable
        loading={applicationsDataLoading}
        data={storekeeperProductForProvider?.productList || []}
        columns={
          relatedProductsStore?.productActiveTab === IGetWmsProvidersStorekeeperProductsTypes.Common
            ? commonProductsColumns
            : moreProductsColumns
        }
        isMobile={isMobile}
        pagination={{
          total: storekeeperProductForProvider?.count,
          current: relatedProductsStore?.pageNumber,
          pageSize: relatedProductsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(storekeeperProductForProvider?.count),
        }}
      />

      {relatedProductsStore.isOpenProductUploadModal && <UploadProductModal />}
    </>
  );
});
