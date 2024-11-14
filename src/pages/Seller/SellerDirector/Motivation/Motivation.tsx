import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {FilterOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {IProductList} from '@/api/product_list/types';
import {DataTable} from '@/components/Datatable/datatable';
import {pmProductListStore} from '@/stores/pmPRoduct';
import {motivationStore} from '@/stores/seller';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {motivationProductsColumns} from './constants';
import styles from './motivation.scss';
import {ProductFilterModal} from './ProductFilterModal';
import {ProductsUpdateModal} from './ProductsUpdateModal';

const cn = classNames.bind(styles);

export const Motivation = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {data: pmsProductData, isLoading: loading} = useQuery({
    queryKey: ['getPmProductList',
      motivationStore.pageSize,
      motivationStore.pageNumber,
      motivationStore.name,
      motivationStore.productsFilter],
    queryFn: () =>
      pmProductListStore.getPmProductList({
        pageSize: motivationStore.pageSize,
        pageNumber: motivationStore.pageNumber,
        name: motivationStore.name!,
        ...motivationStore.productsFilter,
      }),
    select: (data) => data,
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: IProductList[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const productData = selectedRows.length > 0 ? selectedRows : [];

    motivationStore.setSelectedProducts(productData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleOpenFilterModal = () => {
    motivationStore.setIsOpenFilterModal(true);
  };

  const handleUpdateProducts = () => {
    motivationStore.setIsOpenBulkUpdateModal(true);
  };

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    motivationStore.setName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    motivationStore.setPageNumber(page);
    motivationStore.setPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('motivation__head')}>
        <Typography.Title level={3}>Система мотивации</Typography.Title>
        <div className={cn('motivation__filter')}>
          <Button
            onClick={handleUpdateProducts}
            disabled={!(motivationStore?.selectedProducts?.length! > 0)}
          >
            Доля продавца
          </Button>
          <Button
            icon={<FilterOutlined />}
            onClick={handleOpenFilterModal}
          >
            Фильтр
          </Button>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearchName}
            className={cn('motivation__search')}
          />
        </div>
      </div>

      <DataTable
        isMobile={isMobile}
        loading={loading}
        data={pmsProductData?.productList || []}
        columns={motivationProductsColumns}
        pagination={{
          total: pmsProductData?.count,
          current: motivationStore?.pageNumber,
          pageSize: motivationStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(pmsProductData?.count),
        }}
        rowSelection={rowSelection}
        rowKey="id"
      />

      {motivationStore?.isOpenFilterModal && <ProductFilterModal />}
      {motivationStore?.isOpenBulkUpdateModal && <ProductsUpdateModal />}
    </>
  );
});
