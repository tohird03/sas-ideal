import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Input, Typography} from 'antd';
import classNames from 'classnames';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {wmsWarehouseApi} from '@/api/wmsWarehouses';
import {DataTable} from '@/components/Datatable/datatable';
import {warehouseListStore} from '@/stores/mainStorekkeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ChangeMinCountModal} from './ChangeMinCountModal';
import {warehouseProductColumns} from './constants';
import styles from './products.scss';

const cn = classNames.bind(styles);

export const WarehouseProduct = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {warehouseId} = useParams();

  const {data: singleWarehouseData} = useQuery({
    queryKey: [
      'getSingleWarehouse',
      warehouseId,
    ],
    queryFn: () =>
      warehouseId ? wmsWarehouseApi.getSingleWarehouse(warehouseId) : null,
  });

  const {data: warehouseProducts, isLoading: loading} = useQuery({
    queryKey: [
      'getWarehouseProducts',
      warehouseListStore.productName,
      warehouseListStore.productPageNumber,
      warehouseListStore.productPageSize,
      warehouseId,
    ],
    queryFn: () =>
      mainStorekeeperApi.getMainStProduct({
        warehouseId: warehouseId!,
        name: warehouseListStore.productName!,
        pageNumber: warehouseListStore.productPageNumber,
        pageSize: warehouseListStore.productPageSize,
      }),
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    warehouseListStore.setProductPageNumber(1);
    warehouseListStore.setProductName(event.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    warehouseListStore.setProductPageNumber(page);
    warehouseListStore.setProductPageSize(pageSize!);
  };

  useEffect(() => () => {
    warehouseListStore.reset();
  }, []);

  return (
    <>
      <div className={cn('products__head')}>
        <Typography.Title level={3}>Склада: {singleWarehouseData?.name}</Typography.Title>
        <div className={cn('products__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('products__search')}
          />
        </div>
      </div>

      <DataTable
        columns={warehouseProductColumns}
        data={warehouseProducts?.productList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: warehouseProducts?.count,
          current: warehouseListStore?.productPageNumber,
          pageSize: warehouseListStore?.productPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(warehouseProducts?.count),
        }}
      />

      {warehouseListStore.isOpenProductChangeMinCountModal && <ChangeMinCountModal />}
    </>
  );
});
