import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Typography} from 'antd';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {applyProductsStore} from '@/stores/provider';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {orderPaymentsColumns} from '../constants';
import {PrePaymentModal} from './PrePaymentModal';

export const OrderPayment = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <>
      <Typography.Title level={3}>
        Остаток: {priceFormat(sellerMyOrdersStore?.mySingleOrderDatas?.debt)} сум
      </Typography.Title>
      <DataTable
        loading={sellerMyOrdersStore?.mySingleOrderLoading}
        data={sellerMyOrdersStore?.mySingleOrderDatas?.orderPaymentInfos || []}
        columns={orderPaymentsColumns}
        isMobile={isMobile}
        pagination={false}
      />

      {sellerMyOrdersStore.isOpenMySingleOrderPrePaymentsModal && <PrePaymentModal />}
    </>
  );
});
