import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {warehouseTypeApi} from '@/api/warehouseType';
import {DataTable} from '@/components/Datatable/datatable';
import {warehouseTypeStore} from '@/stores/mainStorekkeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditWarehouseTypeModal} from './AddEditWarehouseTypeModal';
import {warehouseTypeColumns} from './constants';
import styles from './warehouse-type.scss';

const cn = classNames.bind(styles);

export const WarehouseType = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: warehouseTypeData, isLoading: loading} = useQuery({
    queryKey: [
      'getWarehouseType',
      warehouseTypeStore.pageNumber,
      warehouseTypeStore.pageSize,
      warehouseTypeStore.name,
    ],
    queryFn: () =>
      warehouseTypeApi.getWarehouseType({
        pageNumber: warehouseTypeStore.pageNumber,
        pageSize: warehouseTypeStore.pageSize,
        name: warehouseTypeStore.name!,
      }),
  });

  const handleAddDWarehouseType = () => {
    warehouseTypeStore.setIsOpenAddEditWarehouseTypeModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    warehouseTypeStore.setName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    warehouseTypeStore.setPageNumber(page);
    warehouseTypeStore.setPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('warehouse-type__head')}>
        <Typography.Title level={3}>Тип склада</Typography.Title>
        <div className={cn('warehouse-type__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('warehouse-type__search')}
          />
          <Button
            onClick={handleAddDWarehouseType}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый тип склада
          </Button>
        </div>
      </div>

      <DataTable
        columns={warehouseTypeColumns}
        data={warehouseTypeData?.warehouseTypeList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: warehouseTypeData?.count,
          current: warehouseTypeStore?.pageNumber,
          pageSize: warehouseTypeStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(warehouseTypeData?.count),
        }}
      />

      {warehouseTypeStore.isOpenAddEditWarehouseTypeModal && <AddEditWarehouseTypeModal />}
    </main>
  );
});
