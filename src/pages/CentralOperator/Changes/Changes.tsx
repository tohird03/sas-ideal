import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {DatePicker, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {changesStore} from '@/stores/centralOperator';
import {applyProductsStore} from '@/stores/provider';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddProductRequestModal} from './AddProductRequestModal';
import {ChangeProductInfoRequestModal} from './ChangeProductInfoRequestModal';
import {styles} from './changes.scss';
import {changesProductsColumns} from './constants';

const cn = classNames.bind(styles);

export const Changes = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    changesStore.setPageSize(pageSize!);
    changesStore.setPageNumber(page);
  };

  const {data: orderDetailsChange, isLoading: getOrderDetailsChangeLoading} =
    useQuery({
      queryKey: [
        'getOrderDetailsChange',
        changesStore.pageNumber,
        changesStore.pageSize,
      ],
      queryFn: () => ordersApi.getOrderDetailChange({
        pageNumber: changesStore.pageNumber,
        pageSize: changesStore.pageSize,
      }),
    });

  return (
    <>
      <div className={cn('changes__header')}>
        <Typography.Title level={3}>Изменения</Typography.Title>
      </div>
      <DataTable
        loading={getOrderDetailsChangeLoading}
        data={orderDetailsChange?.orderDetailChangeList || []}
        columns={changesProductsColumns}
        isMobile={isMobile}
        pagination={{
          total: orderDetailsChange?.count,
          current: changesStore?.pageNumber,
          pageSize: changesStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(orderDetailsChange?.count),
        }}
      />

      {changesStore.isOpenChangeProductInfoRequestModal && <ChangeProductInfoRequestModal />}
      {changesStore.isOpenAddProductRequestModal && <AddProductRequestModal />}
    </>
  );
});
