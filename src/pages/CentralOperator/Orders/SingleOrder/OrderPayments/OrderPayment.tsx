import React from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {ordersStore} from '@/stores/centralOperator';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {orderPaymentsColumns} from '../constants';

export const OrderPayment = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <>
      <Typography.Title level={3}>
        Остаток: {priceFormat(ordersStore?.mySingleOrderDatas?.debt)} сум
      </Typography.Title>
      <DataTable
        loading={ordersStore?.mySingleOrderLoading}
        data={ordersStore?.mySingleOrderDatas?.orderPaymentInfos || []}
        columns={orderPaymentsColumns}
        isMobile={isMobile}
        pagination={false}
      />
    </>
  );
});
