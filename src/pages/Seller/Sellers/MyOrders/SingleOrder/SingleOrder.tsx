import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Tabs} from 'antd';
import {ordersApi} from '@/api/orders';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {EMyOrdersTabs, sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {singleOrderInfoTabs} from './constants';
import {Header} from './Header';

export const SingleOrder = observer(() => {
  const {orderId} = useParams();

  const {data: getMyOrderDetails, isLoading: getMyOrderLoading} =
    useQuery({
      queryKey: ['getMySingleOrder'],
      queryFn: () => ordersApi.getSingleOrder(orderId!),
      enabled: !!orderId,
    });

  const handleSingleOrdersTabChange = (activeKey: string) => {
    sellerMyOrdersStore.setSingleMyOrderActiveTab(activeKey as EMyOrdersTabs);
  };

  useEffect(() => {
    sellerMyOrdersStore.setMySingleOrderLoading(getMyOrderLoading);

    if (getMyOrderDetails) {
      sellerMyOrdersStore.setMySingleOrderDatas(getMyOrderDetails);
    }
  }, [getMyOrderDetails, getMyOrderLoading]);

  return (
    <>
      <Header />
      <Tabs
        defaultActiveKey={sellerMyOrdersStore.singleMyOrderActiveTab}
        items={singleOrderInfoTabs}
        onChange={handleSingleOrdersTabChange}
      />
    </>
  );
});
