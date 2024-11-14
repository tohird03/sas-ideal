import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {DatePicker, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {ordersStore} from '@/stores/centralOperator';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ChangeDeliveryDateModal} from './ChangeDeliveryDateModal';
import {applyProductsColumns} from './constants';
import {styles} from './orders.scss';
import {OrderStatusChangeModal} from './StatusChangeModal';

const cn = classNames.bind(styles);

export const Orders = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: allOrdersData, isLoading: loading} = useQuery({
    queryKey: [
      'getAllOrders',
      ordersStore.pageNumber,
      ordersStore.pageSize,
      ordersStore.startDate,
      ordersStore.endDate,
      ordersStore.searchByProductId,
    ],
    queryFn: () =>
      ordersApi.getAllOrders({
        pageNumber: ordersStore.pageNumber,
        pageSize: ordersStore.pageSize,
        startDate: ordersStore?.startDate!,
        endDate: ordersStore?.endDate!,
        productId: ordersStore?.searchByProductId!,
      }),
  });

  const handleDateChange = (values: any, formatString: [string, string]) => {
    ordersStore.setStartDate(formatString[0] || null);
    ordersStore.setEndDate(formatString[1] || null);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    ordersStore.setPageSize(pageSize!);
    ordersStore.setPageNumber(page);
  };

  const handleSearchByProductId = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    ordersStore.setSearchByProductId(event?.currentTarget?.value || null);
  };

  return (
    <>
      <div className={cn('orders__header')}>
        <Typography.Title level={3}>Все заказы</Typography.Title>
        <div className={cn('orders__filters')}>
          <DatePicker.RangePicker onChange={handleDateChange} />
          <Input
            onChange={handleSearchByProductId}
            placeholder="Поиск по идентификатору продукта"
            className={cn('orders__search')}
          />
        </div>
      </div>
      <DataTable
        loading={loading}
        data={allOrdersData?.orderList || []}
        columns={applyProductsColumns}
        isMobile={isMobile}
        pagination={{
          total: allOrdersData?.count,
          current: ordersStore?.pageNumber,
          pageSize: ordersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(allOrdersData?.count),
        }}
      />

      {ordersStore.isOpenProductStatusChangeModal && <OrderStatusChangeModal />}
      {ordersStore.isOpenProductChangeDeliveryDateModal && <ChangeDeliveryDateModal />}
    </>
  );
});
