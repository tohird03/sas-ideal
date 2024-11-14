
import './prductmanagertissue.scss';

import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {tissueTableColumn} from './constant';
import {ProductManagerTissueAddEditModal} from './ProductManagerTissueAddEditModal/ProductManagerTissueAddEditModal';


export const ProductManagerTissue = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {data: tissueData, isLoading: loading} = useQuery({
    queryKey: [
      'getTissue',
      productManagerStore.pageNumber,
      productManagerStore.pageSize,
      productManagerStore.filter,
    ],
    queryFn: () =>
      productManagerStore.getTissue({
        pageNumber: productManagerStore.pageNumber,
        pageSize: productManagerStore.pageSize,
        name: productManagerStore.filter,
      }),
  });

  const handleAdd = () => {
    productManagerStore.setIsEditTissueProduct(null);
    productManagerStore.setIsOpenTissueAddEditModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    productManagerStore.setFilter(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    productManagerStore.setPageNumber(page);
    productManagerStore.setPageSize(pageSize!);
  };


  useEffect(() => () => {
    productManagerStore.setFilter('');
    productManagerStore.setPageNumber(1);
    productManagerStore.setPageSize(10);
  }, []);

  return (
    <main>
      <div className="product-manager__tissue_head">
        <Typography.Title level={3}>Ткань</Typography.Title>
        <div className="product-manager__tissue_filter">
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className="product-manager__tissue_search"
          />
          <Button
            onClick={handleAdd}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Создавать Ткань
          </Button>
        </div>
      </div>

      <DataTable
        columns={tissueTableColumn}
        data={tissueData?.tissueList!}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: tissueData?.count,
          current: tissueData?.pageNumber,
          pageSize: tissueData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(tissueData?.count),
        }}
      />
      {productManagerStore.isOpenTissueAddEditModal && <ProductManagerTissueAddEditModal />}
    </main>
  );
});
