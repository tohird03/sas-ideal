import '../create-product.scss';

import React, {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Select, Spin, Typography} from 'antd';
import {productApi} from '@/api/product_list/product_list';
import {ROUTES} from '@/constants';
import {categoriesStore} from '@/stores/categories';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {modelStore} from '@/stores/model';
import {providerStore} from '@/stores/provider/provider';
import {tissueStore} from '@/stores/tissue';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const Filter = observer(() => {
  const [categorySearchValue, setCategorySearchValue] = useState<string | null>(null);
  const [modelSearchValue, setModelSearchValue] = useState<string | null>(null);
  const [tissueSearch, setTissueSearch] = useState<string | null>(null);
  const [tissueColorSearch, setTissueColorSearch] = useState<string | null>(null);
  const [providerSearch, setProviderSearch] = useState<string | null>(null);

  const navigate = useNavigate();

  const {data: providersData, isLoading: providersDataLoading} = useQuery({
    queryKey: ['getProviders', providerSearch],
    queryFn: () =>
      providerStore.getProvider({
        pageNumber: 1,
        pageSize: 20,
        description: providerSearch!,
      }),
  });

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

  const hanleProviderFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductProvider(value);
  };

  const hanleDirectionFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductDirection(value);
  };

  const handleNameSearch = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductProductName(value);
  };

  const handleModelNameSearch = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductProductModelName(value);
  };

  const handleCategoryFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductCategory(value);
  };

  const handleModelFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductModel(value);
  };

  const handleTissueFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductTissue(value);
  };

  const handleTissueColorFilter = (value: string) => {
    mainStorekeeperStore.setFilterCreateProductTissueColor(value);
  };

  const handleProviderSearch = (value: string) => {
    setProviderSearch(value);
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

  const handleEnterToCartPage = () => {
    navigate(ROUTES.mainStorekeeperCart);
  };

  const productProviderOptions = useMemo(
    () =>
      providersData?.providerList?.map((productProvider) => ({
        value: productProvider?.id,
        label: productProvider?.name,
      })),
    [providersData]
  );

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

  return (
    <div className="mainstorekeeper-myorder__header">
      <div>
        <Typography.Title level={3}>Товар на складе</Typography.Title>
        <Button
          type="primary"
          onClick={handleEnterToCartPage}
          icon={<ShoppingCartOutlined />}
        >
          Перейти на страницу корзины
        </Button>
      </div>
      <div className="mainstorekeeper-myorder__header__actions">
        <div className="main-st__product-filter-wrapper">
          <Input.Search
            onSearch={handleNameSearch}
            placeholder="Поиск по названия"
          />

          <Input.Search
            onSearch={handleModelNameSearch}
            placeholder="Поиск по модели"
          />
        </div>
        <div className="main-st__product-filter-wrapper">
          <Select
            placeholder="Поставщики"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={
              providersDataLoading ? <Spin size="small" /> : null
            }
            options={productProviderOptions}
            onChange={hanleProviderFilter}
            onSearch={handleProviderSearch}
            filterOption={filterOption}
            loading={providersDataLoading}
            className="main-st__product-filter-select"
          />

          <Select
            placeholder="Угол"
            showSearch
            allowClear
            optionFilterProp="children"
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
