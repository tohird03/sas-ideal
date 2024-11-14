import React from 'react';
import {observer} from 'mobx-react';
import {DataTable} from '@/components/Datatable/datatable';
import {ordersStore} from '@/stores/centralOperator';
import {useMediaQuery} from '@/utils/mediaQuery';
import {orderProductsColumns} from '../constants';

export const OrderProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <DataTable
      loading={ordersStore?.mySingleOrderLoading}
      data={ordersStore?.mySingleOrderDatas?.orderDetails || []}
      columns={orderProductsColumns}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
