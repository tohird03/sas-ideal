import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Input, Select, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './orders.scss';
import { FilterOrderStatusOptions, ordersColumns, ordersTotalCalc } from './constants';
import { ordersStore } from '@/stores/products';
import dayjs from 'dayjs';
import { OrderShowInfoModal } from './OrderShowInfoModal';
import { PaymentModal } from './PaymentModal';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import { ordersApi } from '@/api/order';
import { addNotification } from '@/utils';

const cn = classNames.bind(styles);

export const Orders = observer(() => {
  const { clientId } = useParams();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: ordersData, isLoading: loading } = useQuery({
    queryKey: [
      'getOrders',
      ordersStore.pageNumber,
      ordersStore.pageSize,
      ordersStore.search,
      ordersStore.startDate,
      ordersStore.endDate,
      ordersStore.accepted,
      clientId,
    ],
    queryFn: () =>
      ordersStore.getOrders({
        pageNumber: ordersStore.pageNumber,
        pageSize: ordersStore.pageSize,
        search: ordersStore.search!,
        startDate: ordersStore.startDate!,
        endDate: ordersStore.endDate!,
        ...(ordersStore.accepted ? {accepted: Boolean(ordersStore.accepted)} : {}),
        clientId,
      }),
  });

  const handleAddNewOrder = () => {
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    ordersApi.getAllUploadOrderToExel({
      pageNumber: ordersStore.pageNumber,
      pageSize: ordersStore.pageSize,
      search: ordersStore.search!,
      startDate: ordersStore.startDate!,
      endDate: ordersStore.endDate!,
      clientId,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'order.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    ordersStore.setSearch(e.currentTarget?.value);
  };

  const handleDateChange = (values: any) => {
    if (values) {
      ordersStore.setStartDate(new Date(values[0]));
      ordersStore.setEndDate(new Date(values[1]));
    } else {
      ordersStore.setStartDate(null);
      ordersStore.setEndDate(null);
    }
  };

  const handleChangeFilter = (value: string) => {
    if (value) {
      ordersStore.setAccepted(Boolean(value));

      return;
    }

    ordersStore.setAccepted(null);
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
          <DatePicker.RangePicker
            className={cn('promotion__datePicker')}
            onChange={handleDateChange}
            placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            defaultValue={[dayjs(ordersStore.startDate), dayjs(ordersStore.endDate)]}
          />
          <Select
            options={FilterOrderStatusOptions}
            onChange={handleChangeFilter}
            style={{width: '200px'}}
            placeholder="Sotuv holati"
            allowClear
          />
          <Button
            onClick={handleAddNewOrder}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi sotuv qo&apos;shish
          </Button>
          <Tooltip placement="top" title="Excelda yuklash">
            <Button
              onClick={handleDownloadExcel}
              type="primary"
              icon={<DownloadOutlined />}
              loading={downloadLoading}
            >
              Exelda Yuklash
            </Button>
          </Tooltip>
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

      <div>
        <DataTable
          columns={ordersTotalCalc}
          data={[ordersData?.totalCalc || {}]}
          isMobile
          loading={loading}
          cardStyle={{ width: '500px' }}
          className="total-calc"
          loadingLength={1}
        />
      </div>

      {ordersStore.isOpenAddEditNewOrderModal && <AddEditModal />}
      {ordersStore.isOpenShowOrderModal && <OrderShowInfoModal />}
      {ordersStore.isOpenPaymentModal && <PaymentModal />}
    </main>
  );
});
