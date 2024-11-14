import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Input, Typography} from 'antd';
import classNames from 'classnames';
import {wmsWarehouseApi} from '@/api/wmsWarehouses';
import {DataTable} from '@/components/Datatable/datatable';
import {warehouseListStore} from '@/stores/mainStorekkeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
// import {AddEditWarehouseTypeModal} from './AddEditWarehouseTypeModal';
import {warehouseListColumns} from './constants';
import styles from './warehouse-list.scss';

const cn = classNames.bind(styles);

export const WarehouseList = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: warehouseListData, isLoading: loading} = useQuery({
    queryKey: [
      'getWarehouseList',
      warehouseListStore.pageNumber,
      warehouseListStore.pageSize,
      warehouseListStore.name,
    ],
    queryFn: () =>
      wmsWarehouseApi.getWarehouses({
        pageNumber: warehouseListStore.pageNumber,
        pageSize: warehouseListStore.pageSize,
        name: warehouseListStore.name!,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    warehouseListStore.setName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    warehouseListStore.setPageNumber(page);
    warehouseListStore.setPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('warehouse-list__head')}>
        <Typography.Title level={3}>Склада</Typography.Title>
        <div className={cn('warehouse-list__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('warehouse-list__search')}
          />
        </div>
      </div>

      <DataTable
        columns={warehouseListColumns}
        data={warehouseListData?.warehouseList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: warehouseListData?.count,
          current: warehouseListStore?.pageNumber,
          pageSize: warehouseListStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(warehouseListData?.count),
        }}
      />
    </>
  );
});
