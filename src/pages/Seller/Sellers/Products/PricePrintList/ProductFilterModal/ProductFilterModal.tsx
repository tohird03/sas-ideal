import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Form, Modal, Select, Spin} from 'antd';
import {IOptionType} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {IGetSellerNewProductParams} from '@/api/seller/sellerProducts/types';
import {motivationStore, sellerProductStore} from '@/stores/seller';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ProductFilterModal = observer(() => {
  const [searchOptionsCategory, setSearchOptionsCategory] = useState<string>('');
  const [searchOptionsTissue, setSearchOptionsTissue] = useState<string>('');
  const [tissueColors, setTissueColors] = useState<IOptionType[]>([]);
  const [categoryModels, setCategoryModels] = useState<IOptionType[]>([]);
  const [form] = Form.useForm();

  const {data: productCategoryData, isLoading: categoryLoading} = useQuery({
    queryKey: ['getCategory', searchOptionsCategory],
    queryFn: () =>
      productManagerApi.getCategory({
        pageNumber: 1,
        pageSize: 20,
        title: searchOptionsCategory,
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

  const handleModalClose = () => {
    form.resetFields();
    sellerProductStore.setIsOpenPrintProductFilterModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IGetSellerNewProductParams) => {
    if (values) {
      const clearedUndifineObj = removeUndefinedValues(values);

      sellerProductStore.setPrintProductFilter(clearedUndifineObj);
    }
    handleModalClose();
  };

  const handleChangeTissue = (value: string) => {
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

  const debounceFetcherTissue = (value: string) => {
    setSearchOptionsTissue(value);
  };

  useEffect(() => {
    form.setFieldsValue(sellerProductStore?.printProductFilter);
    if (sellerProductStore?.printProductFilter?.tissueId) {
      const selectedTissue = tissueData?.tissueList?.find((el) =>
        el?.id === sellerProductStore?.printProductFilter?.tissueId);

      setTissueColors(selectedTissue?.tissueColors as any);
    }

    if (sellerProductStore?.printProductFilter?.categoryId) {
      const selectedCategory = productCategoryData?.categoryList?.find((el) =>
        el?.id === sellerProductStore?.printProductFilter?.categoryId);

      setCategoryModels(selectedCategory?.models as any);
    }
  }, []);

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

  const tissueColorsOptions = useMemo(() => (
    tissueColors?.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [tissueColors]);

  const directionOptions = useMemo(() => (
    directionData?.directionList?.map((direction) => ({
      value: direction?.id || '',
      label: direction?.title || '',
    }))
  ), [directionData]);

  return (
    <Modal
      open={sellerProductStore.isOpenPrintProductFilterModal}
      onOk={handleModalOk}
      onCancel={handleModalClose}
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
            onChange={handleChangeTissue}
            placeholder="Ткань"
          />
        </Form.Item>
        <Form.Item
          label="Цвет ткани"
          name="tissueColorId"
          style={{width: '100%'}}
          initialValue={motivationStore.productsFilter?.tissueColorId}
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
  );
});
