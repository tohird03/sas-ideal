import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Input, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './returned-orders.scss';
import { returnedOrdersColumns } from './constants';
import { returnedOrdersStore } from '@/stores/products';
import dayjs from 'dayjs';

const cn = classNames.bind(styles);

export const ReturnedOrders = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: returnedOrdersData, isLoading: loading } = useQuery({
    queryKey: [
      'getReturnedOrders',
      returnedOrdersStore.pageNumber,
      returnedOrdersStore.pageSize,
      returnedOrdersStore.search,
      returnedOrdersStore.startDate,
      returnedOrdersStore.endDate,
    ],
    queryFn: () =>
      returnedOrdersStore.getReturnedOrders({
        pageNumber: returnedOrdersStore.pageNumber,
        pageSize: returnedOrdersStore.pageSize,
        search: returnedOrdersStore.search!,
        startDate: returnedOrdersStore.startDate!,
        endDate: returnedOrdersStore.endDate!,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    returnedOrdersStore.setSearch(e.currentTarget?.value);
  };

  const handleDateChange = (values: any) => {
    if (values) {
      returnedOrdersStore.setStartDate(new Date(values[0]));
      returnedOrdersStore.setEndDate(new Date(values[1]));
    } else {
      returnedOrdersStore.setStartDate(null);
      returnedOrdersStore.setEndDate(null);
    }
  };

  const handleAddNewReturnedOrder = () => {
    returnedOrdersStore.setIsOpenAddEditReturnedOrderModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    returnedOrdersStore.setPageNumber(page);
    returnedOrdersStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    returnedOrdersStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('returned-orders__head')}>
        <Typography.Title level={3}>Mijozdan qaytgan mahsulotlar</Typography.Title>
        <div className={cn('returned-orders__filter')}>
          <Input
            placeholder="Mijozning ismini kiriting"
            allowClear
            onChange={handleSearch}
            className={cn('returned-orders__search')}
          />
          <DatePicker.RangePicker
            className={cn('promotion__datePicker')}
            onChange={handleDateChange}
            placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            defaultValue={[dayjs(returnedOrdersStore.startDate), dayjs(returnedOrdersStore.endDate)]}
          />
          <Button
            onClick={handleAddNewReturnedOrder}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi qaytarish qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={returnedOrdersColumns}
        data={returnedOrdersData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: returnedOrdersData?.totalCount,
          current: returnedOrdersStore?.pageNumber,
          pageSize: returnedOrdersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(returnedOrdersData?.totalCount),
        }}
      />

      {returnedOrdersStore.isOpenAddEditReturnedOrderModal && <AddEditModal />}
    </main>
  );
});
