import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Modal, Select, Spin} from 'antd';
import {IOptionType} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {IPmsProductFilter} from '@/api/productmanager/tyes';
import {usersApi} from '@/api/users/users';
import {productListStore} from '@/stores/product_list/product_list';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

export const ProductManagerProductFilterModal = observer(() => {
  const [searchOptionsProvider, setSearchOptionsProvider] = useState<string | null>(null);
  const [searchOptionsCategory, setSearchOptionsCategory] = useState<string | null>(null);
  const [searchOptionsTissue, setSearchOptionsTissue] = useState<string>('');
  const [tissueColors, setTissueColors] = useState<IOptionType[]>([]);
  const [categoryModels, setCategoryModels] = useState<IOptionType[]>([]);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const filterOption = (input: string, option?: {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleModalClose = () => {
    productListStore.setIsOpenPmsProductFilterModal(false);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IPmsProductFilter) => {
    if (values) {
      const clearedUndifineObj = removeUndefinedValues(values);

      productListStore.setFilterParams(clearedUndifineObj);
      queryClient.invalidateQueries({queryKey: ['getPmProductList']});
    }
    productListStore.setIsOpenPmsProductFilterModal(false);
  };

  const {data: providerData, isLoading: providerDataLoading} = useQuery({
    queryKey: ['getProvider', searchOptionsProvider],
    queryFn: () =>
      usersApi.getProvider({
        pageNumber: 1,
        pageSize: 50,
        search: searchOptionsProvider!,
      }),
  });

  const {data: productCategoryData, isLoading: categoryLoading} = useQuery({
    queryKey: ['getCategory', searchOptionsCategory],
    queryFn: () =>
      productManagerApi.getCategory({
        pageNumber: 1,
        pageSize: 20,
        title: searchOptionsCategory!,
      }),
  });

  const {data: directionData, isLoading: directionDataLoading} = useQuery({
    queryKey: ['getDirection'],
    queryFn: () =>
      productManagerApi.getDirections({
        pageNumber: 1,
        pageSize: 1000,
      }),
  });

  const {data: tissueData, isLoading: tissueDataLoading} = useQuery({
    queryKey: ['getTissue', searchOptionsTissue],
    queryFn: () =>
      productManagerApi.getTissue({
        pageNumber: 1,
        pageSize: 20,
        name: searchOptionsTissue,
      }),
  });

  const tissueColorsOptions = useMemo(() => (
    tissueColors?.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [tissueColors]);

  const providerOptions = useMemo(() => (
    providerData?.userList?.map((el, i) => ({
      value: el?.company?.id,
      label: `${el?.firstName} ${el?.lastName}`,
      key: i,
    }))
  ), [providerData]);


  const productCategoryOptions = useMemo(() => (
    productCategoryData?.categoryList?.map((productCategory => ({
      value: productCategory?.id,
      label: productCategory?.title,
    })))
  ), [productCategoryData]);

  const productModelOptions = useMemo(() => (
    categoryModels?.map((productModel) => ({
      value: productModel?.id || '',
      label: productModel?.name,
    }))
  ), [categoryModels]);

  const tissueOptions = useMemo(() => (
    tissueData?.tissueList?.map((tissue) => ({
      value: tissue?.id || '',
      label: tissue?.name || '',
    }))
  ), [tissueData]);

  const directionOptions = useMemo(() => (
    directionData?.directionList?.map((direction) => ({
      value: direction?.id || '',
      label: direction?.title || '',
    }))
  ), [directionData]);

  const tissueOncChange = (value: string) => {
    form.setFieldValue('tissueColorId', null);
    if (value) {
      const selectedTissue = tissueData?.tissueList?.find((el) => el?.id === value);

      setTissueColors(selectedTissue?.tissueColors as any);
    } else {
      setTissueColors([]);

    }
  };

  const categoryOnChange = (value: string) => {
    form.setFieldValue('modelId', null);
    if (value) {
      const selectedCategory = productCategoryData?.categoryList?.find((el) =>
        el?.id === value);

      setCategoryModels(selectedCategory?.models as any);
    } else {
      setCategoryModels([]);
    }
  };

  const debounceFetcherCategory = (value: string) => {
    setSearchOptionsCategory(value);
  };

  const debounceFetcherProvider = (value: string) => {
    setSearchOptionsProvider(value);
  };

  const debounceFetcherTissue = (value: string) => {
    setSearchOptionsTissue(value);
  };

  useEffect(() => {
    if (productListStore.filterParams?.tissueId) {
      const selectedTissue = tissueData?.tissueList?.find((el) =>
        el?.id === productListStore.filterParams?.tissueId);

      setTissueColors(selectedTissue?.tissueColors as any);
    }

    if (productListStore.filterParams?.categoryId) {
      const selectedCategory = productCategoryData?.categoryList?.find((el) =>
        el?.id === productListStore.filterParams?.categoryId);

      setCategoryModels(selectedCategory?.models as any);
    }
    form.setFieldsValue({
      ...productListStore.filterParams,
    });


  }, [productListStore.isOpenPmsProductFilterModal]);

  const handleResetFilter = () => {
    handleModalClose();
    productListStore.setFilterParams(null);
  };

  return (
    <>
      <Modal
        open={productListStore.isOpenPmsProductFilterModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        cancelButtonProps={{onClick: () => handleResetFilter()}}
        title="Фильтр"
        centered
        width={'500px'}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Поставщик"
            name="providerId"
            style={{width: '100%'}}
          >
            <Select
              allowClear
              showSearch
              loading={providerDataLoading}
              options={providerOptions}
              filterOption={filterOption}
              onSearch={debounceFetcherProvider}
              notFoundContent={providerDataLoading ? <Spin size="small" /> : null}
              placeholder="Поставщик"
              optionFilterProp="children"
            />
          </Form.Item>
          <Form.Item
            label="Вид мебели"
            name="categoryId"
            style={{width: '100%'}}
          >
            <Select
              allowClear
              showSearch
              loading={categoryLoading}
              onSearch={debounceFetcherCategory}
              options={productCategoryOptions}
              filterOption={filterOption}
              onChange={categoryOnChange}
              notFoundContent={categoryLoading ? <Spin size="small" /> : null}
              placeholder="Вид мебели"
              optionFilterProp="children"
            />
          </Form.Item>
          <Form.Item
            label="Модель"
            name="modelId"
            style={{width: '100%'}}
          >
            <Select
              allowClear
              showSearch
              disabled={Boolean(!categoryModels?.length)}
              options={productModelOptions}
              filterOption={filterOption}
              placeholder="Модель"
              optionFilterProp="children"
            />
          </Form.Item>
          <Form.Item
            label="Угол"
            name="directionId"
            style={{width: '100%'}}
          >
            <Select
              options={directionOptions}
              filterOption={filterOption}
              loading={directionDataLoading}
              allowClear
              placeholder="Угол"
            />
          </Form.Item>
          <Form.Item
            label="Ткань"
            name="tissueId"
            style={{width: '100%'}}
          >
            <Select
              allowClear
              loading={tissueDataLoading}
              options={tissueOptions}
              optionFilterProp="children"
              notFoundContent={tissueDataLoading ? <Spin size="small" /> : null}
              filterOption={filterOption}
              onSearch={debounceFetcherTissue}
              onChange={tissueOncChange}
              placeholder="Ткань"
            />
          </Form.Item>
          <Form.Item
            label="Цвет ткани"
            name="tissueColorId"
            style={{width: '100%'}}
            initialValue={productListStore.filterParams?.tissueColorId}
          >
            <Select
              allowClear
              showSearch
              disabled={Boolean(!tissueColors.length)}
              options={tissueColorsOptions}
              filterOption={filterOption}
              optionFilterProp="children"
              placeholder="Цвет ткани"
            />
          </Form.Item>
        </Form>

      </Modal>
    </>
  );
});
