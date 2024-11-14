import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Input, Typography} from 'antd';
import classNames from 'classnames';
import {ordersApi} from '@/api/orders';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {myOrdersColumns} from './constants';
import styles from './my-orders.scss';

const cn = classNames.bind(styles);

export const MyOrders = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: myOrdersData, isLoading: loading} = useQuery({
    queryKey: [
      'getOrders',
      sellerMyOrdersStore.pageNumber,
      sellerMyOrdersStore.pageSize,
      sellerMyOrdersStore.clientName,
      sellerMyOrdersStore.clientPhone,
    ],
    queryFn: () =>
      ordersApi.getSellerOrders({
        pageNumber: sellerMyOrdersStore.pageNumber,
        pageSize: sellerMyOrdersStore.pageSize,
        clientName: sellerMyOrdersStore.clientName!,
        clientPhone: sellerMyOrdersStore.clientPhone!,
      }),
  });

  const handleSearchClientName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sellerMyOrdersStore.setClientName(e.currentTarget.value.trim() || null);
  };

  const handleSearchClientPhone = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sellerMyOrdersStore.setClientPhone(e.currentTarget.value.trim() || null);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    sellerMyOrdersStore.setPageNumber(page);
    sellerMyOrdersStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    sellerMyOrdersStore.reset();
  }, []);

  return (
    <>
      <div className={cn('my-orders__head')}>
        <Typography.Title level={3}>Мои заказы</Typography.Title>
        <div className={cn('my-orders__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearchClientName}
            className={cn('my-orders__search')}
          />
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearchClientPhone}
            className={cn('my-orders__search')}
          />
        </div>
      </div>

      <DataTable
        columns={myOrdersColumns}
        data={myOrdersData?.orderList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: myOrdersData?.count,
          current: sellerMyOrdersStore?.pageNumber,
          pageSize: sellerMyOrdersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(myOrdersData?.count),
        }}
      />
    </>
  );
});
