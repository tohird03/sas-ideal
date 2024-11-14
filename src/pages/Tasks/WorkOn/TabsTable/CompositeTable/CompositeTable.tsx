import React from 'react';
import {observer} from 'mobx-react';
import {DataTable} from '@/components/Datatable/datatable';
import {productListStore} from '@/stores/product_list/product_list';
import {useMediaQuery} from '@/utils/mediaQuery';
import {workOnCompositeTableColumn} from '../../constants';

export const CompositeTable = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <DataTable
      columns={workOnCompositeTableColumn}
      data={productListStore.productIdData?.bases! || []}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
