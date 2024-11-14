import React from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {applyProductsStore} from '@/stores/provider';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {useMediaQuery} from '@/utils/mediaQuery';
import {orderInfoColumns} from '../constants';

export const OrderInfo = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <DataTable
      loading={sellerMyOrdersStore?.mySingleOrderLoading}
      data={[sellerMyOrdersStore?.mySingleOrderDatas]}
      columns={orderInfoColumns}
      isMobile={isMobile}
      pagination={false}
    />
  );
});
