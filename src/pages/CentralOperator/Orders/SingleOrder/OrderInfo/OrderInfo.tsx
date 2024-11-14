import React from 'react';
import {observer} from 'mobx-react';
import {DataTable} from '@/components/Datatable/datatable';
import {ordersStore} from '@/stores/centralOperator';
import {useMediaQuery} from '@/utils/mediaQuery';
import {orderInfoColumns} from '../constants';

export const OrderInfo = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <DataTable
      loading={ordersStore?.mySingleOrderLoading}
      data={[ordersStore?.mySingleOrderDatas]}
      columns={orderInfoColumns}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
