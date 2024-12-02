import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import styles from './product-list.scss';
import {productsListColumn} from './constants';
import { productsListStore } from '@/stores/products';

const cn = classNames.bind(styles);

export const ProductsList = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: productsData, isLoading: loading} = useQuery({
    queryKey: [
      'getProducts',
      productsListStore.pageNumber,
      productsListStore.pageSize,
      productsListStore.search,
    ],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: productsListStore.pageNumber,
        pageSize: productsListStore.pageSize,
        search: productsListStore.search!,
      }),
  });

  const handleAddNewClient = () => {
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    productsListStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    productsListStore.setPageNumber(page);
    productsListStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    productsListStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('product-list__head')}>
        <Typography.Title level={3}>Mahsulotlar</Typography.Title>
        <div className={cn('product-list__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('product-list__search')}
          />
          <Button
            onClick={handleAddNewClient}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mahsulot qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={productsListColumn}
        data={productsData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: productsData?.totalCount,
          current: productsListStore?.pageNumber,
          pageSize: productsListStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(productsData?.totalCount),
        }}
      />

      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
