import './storekeeperMain.scss';

import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {FilterOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Segmented} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import {useMediaQuery} from 'usehooks-ts';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IStorekeeperProductType} from '@/api/storekeeper/types';
import {DataTable} from '@/components/Datatable/datatable';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {
  ProductTabsOptions,
  storekeeperCommonProductsColumns,
  storekeeperMainColumn,
} from './constants';
import {StorekeeperEditStatusMainModal} from './StorekeeperEditStatusMainModal.tsx/StorekeeperEditStatusMainModal.tsx';
import {StorekeeperMainProductAddEditModal} from
  './StorekeeperMainProductAddEditModal/StorekeeperMainProductAddEditModal';
import {StorekeeperMainProductFilterModal} from './StorekeeperMainProductFilterModal/StorekeeperMainProductFilterModal';
import {StorekeeperShipProductModal} from './StorekeeperShipProductModal/StorekeeperShipProductModal';

export const StorekeeperMain = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const handlePageChange = (page: number, pageSize: number | undefined) => {
    storekeeperStore.setPageNumber(page);
    storekeeperStore.setPageSize(pageSize!);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    storekeeperStore.setSearch(e.target.value.trim());
  };

  const {data: allProducts, isLoading: allProductsLoading} = useQuery({
    queryKey: ['getAllProducts',
      storekeeperStore.pageSize,
      storekeeperStore.pageNumber,
      storekeeperStore.search,
      storekeeperStore.filter,
      storekeeperStore.storekeeperProductFIlterParams],
    queryFn: () => storekeeperApi.getAllProducts(
      {
        pageSize: storekeeperStore.pageSize,
        pageNumber: storekeeperStore.pageNumber,
        filter: storekeeperStore.filter ? storekeeperStore.filter : null!,
        ...storekeeperStore.storekeeperProductFIlterParams,
        ...(storekeeperStore.search?.length && {name: storekeeperStore.search}),
      }
    ),
  });

  const handleChangeProductTab = (value: SegmentedValue) => {
    storekeeperStore.setFilter(value as IStorekeeperProductType);
  };

  useEffect(() => {
    storekeeperStore.setStorekeeperProductFIlterParams(null);
    storekeeperStore.setSearch('');
  }, [window.location.pathname]);

  const handleOpenFilterModal = () => {
    storekeeperStore.setIsOpenStorekeeperMainFilterModal(true);
  };


  return (
    <main>
      <div className="storekeeper-main__header">
        <Segmented
          defaultValue={storekeeperStore.filter}
          onChange={handleChangeProductTab}
          options={ProductTabsOptions}
        />

        <div className="storekeeper-main__header__actions">

          <Button
            onClick={handleOpenFilterModal}
          >
            Фильтр <FilterOutlined />
          </Button>

          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
          />
        </div>
      </div>

      <DataTable
        columns={
          storekeeperStore.filter === IStorekeeperProductType.Common
            ? storekeeperCommonProductsColumns
            : storekeeperMainColumn
        }
        loading={allProductsLoading}
        data={allProducts?.productList || []}
        isMobile={isMobile}
        pagination={{
          total: allProducts?.count,
          current: storekeeperStore.pageNumber,
          pageSize: storekeeperStore.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(allProducts?.count),
        }}
      />
      {storekeeperStore.isOpenStorekeeperMainProductAddEditModal
        && <StorekeeperMainProductAddEditModal />}

      {storekeeperStore.isOpenStorekeeperMainFilterModal
        && <StorekeeperMainProductFilterModal status />}

      {storekeeperStore.isOpenStorekeeperShipProductModal
        && <StorekeeperShipProductModal />}

      {storekeeperStore.isOpenStorekeeperEditStatusMainModal
      && <StorekeeperEditStatusMainModal />}
    </main>
  );
});
