import './myOrder.scss';

import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Tabs, TabsProps} from 'antd';
import {useMediaQuery} from 'usehooks-ts';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {ChangeStatusModal} from './ChangeStatusModal';
import {
  mainstorekeeperWarehouseProductsColumn,
  mainstorekeeperWarehouseProductsDetailsColumn,
} from './constants';
import {Filter} from './Filter';
import {OrderProductModal} from './OrderProductModal';

export const MainStorekeeperProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: mainStProductData, isLoading: loading} = useQuery({
    queryKey: [
      'getMainStProduct',
      mainStorekeeperStore.filterModel,
      mainStorekeeperStore.filterCategory,
      mainStorekeeperStore.filterTissue,
      mainStorekeeperStore.filterTissueColor,
      mainStorekeeperStore.filterWarehouse,
      mainStorekeeperStore.filterProductName,
      mainStorekeeperStore.filterProductModelName,
      mainStorekeeperStore.filterDirection,
      mainStorekeeperStore.filterDetails,
      mainStorekeeperStore.pageNumber,
      mainStorekeeperStore.pageSize,
    ],
    queryFn: () =>
      mainStorekeeperApi.getMainStProduct({
        modelId: mainStorekeeperStore.filterModel!,
        categoryId: mainStorekeeperStore.filterCategory!,
        tissueId: mainStorekeeperStore.filterTissue!,
        tissueColorId: mainStorekeeperStore.filterTissueColor!,
        warehouseId: mainStorekeeperStore.filterWarehouse!,
        name: mainStorekeeperStore.filterProductName!,
        modelName: mainStorekeeperStore.filterProductModelName!,
        directionId: mainStorekeeperStore.filterDirection!,
        filter: mainStorekeeperStore.filterDetails!,
        pageSize: mainStorekeeperStore.pageSize,
        pageNumber: mainStorekeeperStore.pageNumber,
      }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    mainStorekeeperStore.setPageNumber(page);
    mainStorekeeperStore.setPageSize(pageSize!);
  };

  const warehouseProductsTabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Общий',
      children: (
        <>
          <DataTable
            columns={mainstorekeeperWarehouseProductsDetailsColumn}
            data={mainStProductData?.productList!}
            isMobile={isMobile}
            loading={loading}
            pagination={{
              total: mainStProductData?.count,
              current: mainStProductData?.pageNumber,
              pageSize: mainStProductData?.pageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(mainStProductData?.count),
            }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: 'Подробно',
      children: (
        <>
          <DataTable
            columns={mainstorekeeperWarehouseProductsColumn}
            data={mainStProductData?.productList!}
            isMobile={isMobile}
            loading={loading}
            pagination={{
              total: mainStProductData?.count,
              current: mainStProductData?.pageNumber,
              pageSize: mainStProductData?.pageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(mainStProductData?.count),
            }}
          />
        </>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    mainStorekeeperStore.setFilterDetails(null);
    mainStorekeeperStore.setFilterModel(null);
    mainStorekeeperStore.setFilterCategory(null);
    mainStorekeeperStore.setFilterTissue(null);
    mainStorekeeperStore.setFilterTissueColor(null);
    mainStorekeeperStore.setFilterWarehouse(null);
    mainStorekeeperStore.setFilterProductName(null);
    mainStorekeeperStore.setFilterDirection(null);
    mainStorekeeperStore.setFilterProductModelName(null);
    mainStorekeeperStore.setPageNumber(1);
    mainStorekeeperStore.setPageSize(10);


    if (key === '1') {
      mainStorekeeperStore.setFilterDetails('details');
    }
  };

  return (
    <>
      <Filter />

      <Tabs
        defaultActiveKey="1"
        items={warehouseProductsTabItems}
        onChange={handleTabChange}
      />

      {mainStorekeeperStore.isOpenChangeStatusModal && <ChangeStatusModal />}
      {mainStorekeeperStore.isOpenOrderProductModal && <OrderProductModal />}
    </>
  );
});
