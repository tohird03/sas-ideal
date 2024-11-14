import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Tabs, Typography} from 'antd';
import classNames from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {ordersStore} from '@/stores/centralOperator';
import {EMyOrdersTabs} from '@/stores/seller/seller/orders/orders';
import {singleOrderInfoTabs} from './constants';
import styles from './single-order.scss';

const cn = classNames.bind(styles);

export const SingleOrder = observer(() => {
  const {orderId} = useParams();

  const {data: getOrderDetails, isLoading: getMyOrderLoading} =
    useQuery({
      queryKey: ['getSingleOrder'],
      queryFn: () => ordersApi.getSingleOrder(orderId!),
      enabled: !!orderId,
    });

  const handleSingleOrdersTabChange = (activeKey: string) => {
    ordersStore.setSingleMyOrderActiveTab(activeKey as EMyOrdersTabs);
  };

  useEffect(() => {
    ordersStore.setMySingleOrderLoading(getMyOrderLoading);

    if (getOrderDetails) {
      ordersStore.setMySingleOrderDatas(getOrderDetails);
    }
  }, [getOrderDetails, getMyOrderLoading]);

  return (
    <>
      <div className={cn('single-order__header-wrapper')}>
        <Typography.Title level={3}>
          Сделка №{getOrderDetails?.orderId}
        </Typography.Title>
        <div className={cn('single-order__header-right-wrapper')}>
          <Typography.Title level={3}>
            Продавец
          </Typography.Title>
          <div>
            <Typography.Paragraph>
              {getOrderDetails?.seller?.firstName}
              {getOrderDetails?.seller?.lastName}
            </Typography.Paragraph>
            <Typography.Paragraph>
              +{getOrderDetails?.seller?.phone}
            </Typography.Paragraph>
          </div>
        </div>
      </div>
      <Tabs
        defaultActiveKey={ordersStore.singleMyOrderActiveTab}
        items={singleOrderInfoTabs}
        onChange={handleSingleOrdersTabChange}
      />
    </>
  );
});
