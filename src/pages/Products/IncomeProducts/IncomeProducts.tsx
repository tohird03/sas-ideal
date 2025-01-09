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
import styles from './income-products.scss';
import { incomeOrdersColumns } from './constants';
import { incomeProductsStore } from '@/stores/products';
import { OrderShowInfoModal } from './OrderShowInfoModal';
import { PaymentModal } from './PaymentModal';
import { useParams } from 'react-router-dom';
import { addNotification } from '@/utils';
import dayjs from 'dayjs';
import { incomeProductsApi } from '@/api/income-products';

const cn = classNames.bind(styles);

export const IncomeProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { supplierId } = useParams();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: incomeOrdersData, isLoading: loading } = useQuery({
    queryKey: [
      'getIncomeOrders',
      incomeProductsStore.pageNumber,
      incomeProductsStore.pageSize,
      incomeProductsStore.search,
      incomeProductsStore.startDate,
      incomeProductsStore.endDate,
      supplierId,
    ],
    queryFn: () =>
      incomeProductsStore.getIncomeOrders({
        pageNumber: incomeProductsStore.pageNumber,
        pageSize: incomeProductsStore.pageSize,
        search: incomeProductsStore.search!,
        startDate: incomeProductsStore.startDate!,
        endDate: incomeProductsStore.endDate!,
        supplierId,
      }),
  });

  const handleAddIncomeProduct = () => {
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    incomeProductsStore.setPageNumber(page);
    incomeProductsStore.setPageSize(pageSize!);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    incomeProductsStore.setSearch(e.currentTarget?.value);
  };


  const handleDateChange = (values: any) => {
    if (values) {
      incomeProductsStore.setStartDate(new Date(values[0]));
      incomeProductsStore.setEndDate(new Date(values[1]));
    } else {
      incomeProductsStore.setStartDate(null);
      incomeProductsStore.setEndDate(null);
    }
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    incomeProductsApi.getAllUploadIncomeOrderToExel({
      pageNumber: incomeProductsStore.pageNumber,
      pageSize: incomeProductsStore.pageSize,
      search: incomeProductsStore.search!,
      startDate: incomeProductsStore.startDate!,
      endDate: incomeProductsStore.endDate!,
      supplierId,
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

  useEffect(() => () => {
    incomeProductsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('income-products__head')}>
        <Typography.Title level={3}>Tushurilgan mahsulotlar</Typography.Title>
        <div className={cn('income-products__filter')}>
          <Input
            placeholder="Qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('orders__search')}
          />
          <DatePicker.RangePicker
            className={cn('promotion__datePicker')}
            onChange={handleDateChange}
            placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            defaultValue={[dayjs(incomeProductsStore.startDate), dayjs(incomeProductsStore.endDate)]}
          />
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
          <Button
            onClick={handleAddIncomeProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi mahsulot tushurish
          </Button>
        </div>
      </div>

      <DataTable
        columns={incomeOrdersColumns}
        data={incomeOrdersData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: incomeOrdersData?.totalCount,
          current: incomeProductsStore?.pageNumber,
          pageSize: incomeProductsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(incomeOrdersData?.totalCount),
        }}
      />

      {incomeProductsStore.isOpenAddEditIncomeProductsModal && <AddEditModal />}
      {incomeProductsStore.isOpenShowIncomeOrderModal && <OrderShowInfoModal />}
      {incomeProductsStore.isOpenIncomeOrderPaymentModal && <PaymentModal />}
    </main>
  );
});
