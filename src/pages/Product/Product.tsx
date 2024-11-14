import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Select, Spin, Typography} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {categoriesStore} from '@/stores/categories';
import {modelStore} from '@/stores/model';
import {productListStore} from '@/stores/product_list/product_list';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddProductListModal} from './_component/AddProductListModal';
import {ProductFileModal} from './_component/ProductFileModal';
import {productListColumns} from './constant';
import styles from './product_list.module.css';

export const Product = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [categorySearchValue, setCategorySearchValue] = useState<string>('');
  const [modelSearchValue, setModelSearchValue] = useState<string>('');

  const {data: productListData, isLoading: loading} = useQuery({
    queryKey: ['getProductList',
      productListStore.pageSize,
      productListStore.pageNumber,
      productListStore.search,
      productListStore.categoryFilter,
      productListStore.modelFilter],
    queryFn: () =>
      productListStore.getProductList({
        pageSize: productListStore.pageSize,
        pageNumber: productListStore.pageNumber,
        name: productListStore.search,
        ...(productListStore.categoryFilter && {categoryId: productListStore.categoryFilter}),
        ...(productListStore.modelFilter && {modelId: productListStore.modelFilter}),
      }),
  });

  const {data: productCategoryData, isLoading: categoryLoading} = useQuery({
    queryKey: ['getCategory', categoriesStore.page, categoriesStore.limit, categorySearchValue],
    queryFn: () =>
      categoriesStore.getCategory({
        pageNumber: categoriesStore.page,
        pageSize: categoriesStore.limit,
        title: categorySearchValue,
      }),
  });

  const {data: productModelData, isLoading: modelLoading} = useQuery({
    queryKey: ['getModel', modelStore.page, modelStore.limit, modelSearchValue],
    queryFn: () =>
      modelStore.getModel({
        pageNumber: modelStore.page,
        pageSize: modelStore.limit,
        name: modelSearchValue,
      }),
  });

  const handlePageChange = useCallback((page: number, pageSize: number | undefined) => {
    productListStore.setPageSize(pageSize!);
    productListStore.setPageNumber(page);
  }, []);

  const handleAddNewProduct = () => {
    productListStore.editProductList = null;
    productListStore.setIsOpenProductModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    productListStore.setSearch(e.currentTarget.value.trim());
  };

  const handleCategoryFilter = (value: string) => {
    productListStore.setCategoryFilter(value);
  };

  const handleModelFilter = (value: string) => {
    productListStore.setModelFilter(value);
  };

  const filterOption = (input: string, option?: {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const productCategoryOptions = useMemo(() => (
    productCategoryData?.categoryList?.map((productCategory => ({
      value: productCategory?.id,
      label: productCategory?.title,
    })))
  ), [productCategoryData]);

  const productModelOptions = useMemo(() => (
    productModelData?.modelList?.map((productModel) => ({
      value: productModel?.id || '',
      label: productModel?.name,
    }))
  ), [productModelData]);

  const handleSearchCategory = (value: string) => {
    setCategorySearchValue(value);
  };

  const handleSearchModel = (value: string) => {
    setModelSearchValue(value);
  };

  useEffect(() => () => {
    productListStore.setSearch('');
  }, []);

  return (
    <>
      <div className={styles.product_list__head}>
        <Typography.Title level={3}>Список продуктов</Typography.Title>
        <div className={styles.product_list__filter}>
          <Input
            placeholder="Поиск по пользователей"
            allowClear
            onChange={handleSearch}
            className={styles.product_list__search}
          />
          <Select
            placeholder="Фильтр по категории"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={categoryLoading ? <Spin size="small" /> : null}
            options={productCategoryOptions}
            onChange={handleCategoryFilter}
            onSearch={handleSearchCategory}
            filterOption={filterOption}
            className={styles.product_list__search}
          />

          <Select
            placeholder="Фильтр по модели"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={modelLoading ? <Spin size="small" /> : null}
            options={productModelOptions}
            onChange={handleModelFilter}
            onSearch={handleSearchModel}
            filterOption={filterOption}
            className={styles.product_list__search}
          />


          <Button
            onClick={handleAddNewProduct}
            type="primary"
            icon={<PlusOutlined />}
          >
              Новый продукт
          </Button>
        </div>
      </div>

      <DataTable
        loading={loading}
        columns={productListColumns}
        data={productListData?.productList || []}
        isMobile={isMobile}
        pagination={{
          total: productListData?.count,
          current: productListData?.pageNumber,
          pageSize: productListData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(productListData?.count),
        }}
      />

      {productListStore.isOpenProductModal && <AddProductListModal />}
      {productListStore.isOpenFileModal && <ProductFileModal />}
    </>
  );
});
