import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './orders.scss';
import { ordersColumns } from './constants';
import { ordersStore } from '@/stores/products';

const cn = classNames.bind(styles);

export const Orders = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: ordersData, isLoading: loading } = useQuery({
    queryKey: [
      'getOrders',
      ordersStore.pageNumber,
      ordersStore.pageSize,
      ordersStore.search,
    ],
    queryFn: () =>
      ordersStore.getOrders({
        pageNumber: ordersStore.pageNumber,
        pageSize: ordersStore.pageSize,
        search: ordersStore.search!,
      }),
  });

  const handleAddNewOrder = () => {
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    ordersStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    ordersStore.setPageNumber(page);
    ordersStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    ordersStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('orders__head')}>
        <Typography.Title level={3}>Sotuvlar ro&apos;yxati</Typography.Title>
        <div className={cn('orders__filter')}>
          <Input
            placeholder="Sotuvlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('orders__search')}
          />
          <Button
            onClick={handleAddNewOrder}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi sotuv qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={ordersColumns}
        data={ordersData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: ordersData?.totalCount,
          current: ordersStore?.pageNumber,
          pageSize: ordersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(ordersData?.totalCount),
        }}
      />

      {ordersStore.isOpenAddEditNewOrderModal && <AddEditModal />}
    </main>
  );
});
