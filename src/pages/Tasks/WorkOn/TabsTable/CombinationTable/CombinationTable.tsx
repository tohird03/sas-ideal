import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {DataTable} from '@/components/Datatable/datatable';
import {productListStore} from '@/stores/product_list/product_list';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {workOnCombinationTableColumn} from '../../constants';

export const CombinationTable = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {};

  return (
    <DataTable
      columns={workOnCombinationTableColumn}
      data={productListStore?.productIdData?.combinations!}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
