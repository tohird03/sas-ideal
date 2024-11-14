import React, {useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Table} from 'antd';
import {IProductList} from '@/api/product_list/types';
import {pmProductListStore} from '@/stores/pmPRoduct';
import {productListStore} from '@/stores/product_list/product_list';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {productManagerMainProductColumn} from '../constant';

export const ProductManagerMainProductTable = observer(() => {
  const tabKey = productManagerStore.productManagerMainTabKey;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


  const {data: productListData, isLoading: loading} = useQuery({
    queryKey: ['getPmProductList',
      productListStore.pageSize,
      productListStore.pageNumber,
      productListStore.search,
      productListStore.filterParams],
    queryFn: () =>
      pmProductListStore.getPmProductList({
        pageSize: productListStore.pageSize,
        pageNumber: productListStore.pageNumber,
        name: productListStore.search,
        ...productListStore.filterParams,
      }),
    select: (data) => data,
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: IProductList[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const productData = selectedRows.length > 0 ? selectedRows : [];

    productManagerStore.setIsProductManagerMainSelectedProduct(productData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handlePageChange = useCallback((page: number, pageSize: number | undefined) => {
    productListStore.setPageSize(pageSize!);
    productListStore.setPageNumber(page);
  }, []);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [tabKey]);

  return (
    <>
      <main>
        <Table
          bordered
          loading={loading}
          columns={productManagerMainProductColumn}
          dataSource={productListData?.productList || []}
          pagination={{
            total: productListData?.count,
            current: productListData?.pageNumber,
            pageSize: productListData?.pageSize,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(productListData?.count),
          }}
          rowSelection={rowSelection}
          rowKey="id"
        />
      </main>
    </>
  );
});
