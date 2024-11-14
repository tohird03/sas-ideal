import '../myOrder.scss';

import React, {ChangeEventHandler, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Input, Select, Spin, Typography} from 'antd';
import {productApi} from '@/api/product_list/product_list';
import {categoriesStore} from '@/stores/categories';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {modelStore} from '@/stores/model';
import {tissueStore} from '@/stores/tissue';
import {warehouseStore} from '@/stores/warehouse';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const Filter = observer(() => {
  const [categorySearchValue, setCategorySearchValue] = useState<string | null>(null);
  const [modelSearchValue, setModelSearchValue] = useState<string | null>(null);
  const [tissueSearch, setTissueSearch] = useState<string | null>(null);
  const [tissueColorSearch, setTissueColorSearch] = useState<string | null>(null);
  const [warehouseSearch, setWarehouseSearch] = useState<string | null>(null);

  const {data: directionData, isLoading: directionDataLoading} = useQuery({
    queryKey: ['getDirections'],
    queryFn: () =>
      productApi.getAllDirection({
        pageNumber: 1,
        pageSize: 50,
      }),
  });

  const {data: productCategoryData, isLoading: categoryLoading} = useQuery({
    queryKey: ['getCategory', categorySearchValue],
    queryFn: () =>
      categoriesStore.getCategory({
        pageNumber: 1,
        pageSize: 20,
        title: categorySearchValue!,
      }),
  });

  const {data: productModelData, isLoading: modelLoading} = useQuery({
    queryKey: ['getModel', modelSearchValue],
    queryFn: () =>
      modelStore.getModel({
        pageNumber: 1,
        pageSize: 20,
        name: modelSearchValue!,
      }),
  });

  const {data: tissueData, isLoading: tissueLoading} = useQuery({
    queryKey: ['getTissue', tissueSearch],
    queryFn: () =>
      tissueStore.getTissue({
        name: tissueSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {data: tissueColorData, isLoading: tissueColorLoading} = useQuery({
    queryKey: ['getTissueColor', tissueColorSearch],
    queryFn: () =>
      tissueStore.getTissueColor({
        name: tissueColorSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {data: warehouseData, isLoading: warehouseLoading} = useQuery({
    queryKey: ['getWarehouse', warehouseSearch],
    queryFn: () =>
      warehouseStore.getWarehouses({
        name: warehouseSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const handleNameSearch = (value: React.ChangeEvent<HTMLInputElement>) => {
    mainStorekeeperStore.setFilterProductName(value.target.value);
  };

  const handleModelNameSearch = (
    value: React.ChangeEvent<HTMLInputElement>
  ) => {
    mainStorekeeperStore.setFilterProductModelName(value.target.value);
  };

  const handleCategoryFilter = (value: string) => {
    mainStorekeeperStore.setFilterCategory(value);
  };

  const handleModelFilter = (value: string) => {
    mainStorekeeperStore.setFilterModel(value);
  };

  const handleTissueFilter = (value: string) => {
    mainStorekeeperStore.setFilterTissue(value);
  };

  const handleTissueColorFilter = (value: string) => {
    mainStorekeeperStore.setFilterTissueColor(value);
  };

  const handleWarehouseFilter = (value: string) => {
    mainStorekeeperStore.setFilterWarehouse(value);
  };

  const hanleDirectionFilter = (value: string) => {
    mainStorekeeperStore.setFilterDirection(value);
  };

  const handleSearchCategory = (value: string) => {
    setCategorySearchValue(value);
  };

  const handleSearchModel = (value: string) => {
    setModelSearchValue(value);
  };

  const handleSearchTissue = (value: string) => {
    setTissueSearch(value);
  };
  const handleSearchTissueColor = (value: string) => {
    setTissueColorSearch(value);
  };

  const handleSearchWarehouse = (value: string) => {
    setWarehouseSearch(value);
  };

  const productDirectionOptions = useMemo(
    () =>
      directionData?.directionList?.map((productDirection) => ({
        value: productDirection?.id,
        label: productDirection?.title,
      })),
    [directionData]
  );

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

  const tissueOptions = useMemo(() => (
    tissueData?.tissueList?.map((tissue) => ({
      value: tissue?.id || '',
      label: tissue?.name,
    }))
  ), [tissueData]);

  const tissueColorOptions = useMemo(() => (
    tissueColorData?.tissueColorList?.map((tissueColor) => ({
      value: tissueColor?.id || '',
      label: tissueColor?.name,
    }))
  ), [tissueColorData]);

  const warehouseOptions = useMemo(() => (
    warehouseData?.warehouseList?.map((warehouse) => ({
      value: warehouse?.id || '',
      label: warehouse?.name,
    }))
  ), [warehouseData]);

  return (
    <div className="mainstorekeeper-myorder__header">
      <Typography.Title level={3}>Товар на складе</Typography.Title>
      <div className="mainstorekeeper-myorder__header__actions">
        <div className="main-st__product-filter-wrapper">
          <Input.Search
            value={mainStorekeeperStore.filterProductName ?? ''}
            onChange={handleNameSearch}
            placeholder="Поиск по названия"
          />

          <Input.Search
            value={mainStorekeeperStore.filterProductModelName ?? ''}
            onChange={handleModelNameSearch}
            placeholder="Поиск по модели"
          />
        </div>

        <div className="main-st__product-filter-wrapper">
          <Select
            placeholder="Склад"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterWarehouse ?? undefined}
            notFoundContent={warehouseLoading ? <Spin size="small" /> : null}
            options={warehouseOptions}
            onChange={handleWarehouseFilter}
            onSearch={handleSearchWarehouse}
            filterOption={filterOption}
            loading={warehouseLoading}
            className="main-st__product-filter-select"
          />

          <Select
            placeholder="Угол"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterDirection ?? undefined}
            notFoundContent={
              directionDataLoading ? <Spin size="small" /> : null
            }
            options={productDirectionOptions}
            onChange={hanleDirectionFilter}
            loading={directionDataLoading}
            filterOption={filterOption}
            className="main-st__product-filter-select"
          />
        </div>

        <div className="main-st__product-filter-wrapper">
          <Select
            placeholder="Категории"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterCategory ?? undefined}
            notFoundContent={categoryLoading ? <Spin size="small" /> : null}
            options={productCategoryOptions}
            onChange={handleCategoryFilter}
            onSearch={handleSearchCategory}
            filterOption={filterOption}
            loading={categoryLoading}
            className="main-st__product-filter-select"
          />

          <Select
            placeholder="Модели"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterModel ?? undefined}
            notFoundContent={modelLoading ? <Spin size="small" /> : null}
            options={productModelOptions}
            onChange={handleModelFilter}
            onSearch={handleSearchModel}
            filterOption={filterOption}
            className="main-st__product-filter-select"
          />
        </div>

        <div className="main-st__product-filter-wrapper">
          <Select
            placeholder="Ткань"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterTissue ?? undefined}
            notFoundContent={tissueLoading ? <Spin size="small" /> : null}
            options={tissueOptions}
            onChange={handleTissueFilter}
            onSearch={handleSearchTissue}
            filterOption={filterOption}
            loading={tissueLoading}
            className="main-st__product-filter-select"
          />

          <Select
            placeholder="Цвет ткани"
            showSearch
            allowClear
            optionFilterProp="children"
            value={mainStorekeeperStore.filterTissueColor ?? undefined}
            notFoundContent={tissueColorLoading ? <Spin size="small" /> : null}
            options={tissueColorOptions}
            onChange={handleTissueColorFilter}
            onSearch={handleSearchTissueColor}
            filterOption={filterOption}
            loading={tissueColorLoading}
            className="main-st__product-filter-select"
          />
        </div>
      </div>
    </div>
  );
});
