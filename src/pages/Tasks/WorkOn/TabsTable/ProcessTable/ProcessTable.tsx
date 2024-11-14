import React from 'react';
import {observer} from 'mobx-react';
import {DataTable} from '@/components/Datatable/datatable';
import {productListStore} from '@/stores/product_list/product_list';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {workOnProcessTableColumn} from '../../constants';

export const ProcessTable = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');


  const handlePageChange = (
    page: number,
    pageSize: number | undefined
  ) => {};

  return (
    <DataTable
      columns={workOnProcessTableColumn}
      data={productListStore?.productIdData?.processes!}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
