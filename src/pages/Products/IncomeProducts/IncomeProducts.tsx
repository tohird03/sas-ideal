import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './income-products.scss';
import { incomeOrdersColumns } from './constants';
import { incomeProductsStore } from '@/stores/products';

const cn = classNames.bind(styles);

export const IncomeProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: incomeOrdersData, isLoading: loading } = useQuery({
    queryKey: [
      'getOrders',
      incomeProductsStore.pageNumber,
      incomeProductsStore.pageSize,
      incomeProductsStore.search,
    ],
    queryFn: () =>
      incomeProductsStore.getIncomeOrders({
        pageNumber: incomeProductsStore.pageNumber,
        pageSize: incomeProductsStore.pageSize,
        search: incomeProductsStore.search!,
      }),
  });

  const handleAddIncomeProduct = () => {
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    incomeProductsStore.setPageNumber(page);
    incomeProductsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    incomeProductsStore.reset();
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
    </main>
  );
});
