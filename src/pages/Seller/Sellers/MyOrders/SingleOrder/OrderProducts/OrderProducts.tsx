import React from 'react';
import {observer} from 'mobx-react';
import {DataTable} from '@/components/Datatable/datatable';
import {sellerStore} from '@/stores/seller';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {useMediaQuery} from '@/utils/mediaQuery';
import {orderProductsColumns} from '../constants';
import {OrderProductUpdateModal} from './OrderProductUpdateModal';

export const OrderProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <>
      <DataTable
        loading={sellerMyOrdersStore?.mySingleOrderLoading}
        data={sellerMyOrdersStore?.mySingleOrderDatas?.orderDetails || []}
        columns={orderProductsColumns}
        isMobile={isMobile}
        pagination={false}
      />

      {sellerStore.isOpenOrderDetailsProductUpdateModal && <OrderProductUpdateModal />}
    </>
  );
});
