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
import styles from './income-products.scss';
import { supplierColumns } from './constants';
import { supplierInfoStore } from '@/stores/supplier';

const cn = classNames.bind(styles);

export const IncomeProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: supplierData, isLoading: loading } = useQuery({
    queryKey: [
      'getSuppliers',
      supplierInfoStore.pageNumber,
      supplierInfoStore.pageSize,
      supplierInfoStore.search,
    ],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: supplierInfoStore.pageNumber,
        pageSize: supplierInfoStore.pageSize,
        search: supplierInfoStore.search!,
      }),
  });

  const handleAddIncomeProduct = () => {
    supplierInfoStore.setIsOpenAddEditSupplierModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierInfoStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierInfoStore.setPageNumber(page);
    supplierInfoStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    supplierInfoStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('income-products__head')}>
        <Typography.Title level={3}>Tushurilgan mahsulotlar</Typography.Title>
        <div className={cn('income-products__filter')}>
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
        columns={supplierColumns}
        data={supplierData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: supplierData?.totalCount,
          current: supplierInfoStore?.pageNumber,
          pageSize: supplierInfoStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(supplierData?.totalCount),
        }}
      />

      {supplierInfoStore.isOpenAddEditSupplierModal && <AddEditModal />}
    </main>
  );
});
