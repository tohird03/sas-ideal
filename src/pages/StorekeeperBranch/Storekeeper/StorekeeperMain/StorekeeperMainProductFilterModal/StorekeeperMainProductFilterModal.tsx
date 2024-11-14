import React, {FC, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Modal, Select, Spin} from 'antd';
import {IOptionType} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IStorekeeperFilter} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

type Props = {
  status: boolean;
};
export const StorekeeperMainProductFilterModal: FC<Props> = observer(({status}) => {

  const [searchOptionsCategory, setSearchOptionsCategory] = useState<string>('');
  const [searchOptionsTissue, setSearchOptionsTissue] = useState<string>('');
  const [tissueColors, setTissueColors] = useState<IOptionType[]>([]);
  const [categoryModels, setCategoryModels] = useState<IOptionType[]>([]);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const handleModalClose = () => {
    storekeeperStore.setIsOpenStorekeeperMainFilterModal(false);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IStorekeeperFilter) => {
    if (values) {
      const clearedUndifineObj = removeUndefinedValues(values);

      storekeeperStore.setStorekeeperProductFIlterParams(clearedUndifineObj);
      queryClient.invalidateQueries({queryKey: ['getAllProducts']});
    }
    storekeeperStore.setIsOpenStorekeeperMainFilterModal(false);
  };


  const {data: directionData, isLoading: directionLoading} = useQuery({
    queryKey: ['getStorekeeperAllDirections'],
    queryFn: () => productManagerApi.getDirections(
      {
        pageNumber: 1,
        pageSize: 20,
      }
    ),
  });

  const {data: productStatusData, isLoading: productStatusDataLoading} = useQuery({
    queryKey: ['getStorekeeperProductStatusData'],
    queryFn: () => storekeeperApi.getProductStatus(
      {
        pageNumber: 1,
        pageSize: 20,
      }
    ),
  });

  const {data: categoryData, isLoading: categoryLoading} = useQuery({
    queryKey: ['getStorekeeperCategoryData', searchOptionsCategory],
    queryFn: () => productManagerApi.getCategory({
      title: searchOptionsCategory,
      pageSize: 20,
      pageNumber: 1,
    }),
  });

  const {data: tissueData, isLoading: tissueLoading} = useQuery({
    queryKey: ['getStorekeeperTissueData', searchOptionsTissue],
    queryFn: () =>
      productManagerApi.getTissue({
        name: searchOptionsTissue,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const filterOption = (input: string, option?:
  {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const categoryOptions = useMemo(() => (
    categoryData?.categoryList?.map((cat, i) => ({
      value: cat?.id,
      label: cat?.title,
      key: i,
    }))
  ), [categoryData]);

  const allDirectionsOptions = useMemo(() => (
    directionData?.directionList?.map((dir, i) => ({
      value: dir?.id || '',
      label: dir?.title || '',
      key: i,
    }))
  ), [directionData]);

  const allModelsOptions = useMemo(() => (
    categoryModels?.map((model, i) => ({
      value: model?.id,
      label: model?.name,
      key: i,
    }))
  ), [categoryModels]);

  const tissueOptions = useMemo(() => (
    tissueData?.tissueList?.map((t, i) => ({
      value: t?.id || '',
      label: t?.name || '',
      key: i,
    }))
  ), [tissueData]);

  const tissueColorsOptions = useMemo(() => (
    tissueColors?.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [tissueColors]);

  const productStatusOptions = useMemo(() => (
    productStatusData?.productStatusList.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [productStatusData]);

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
      const selectedCategory = categoryData?.categoryList?.find((el) =>
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
    if (storekeeperStore.storekeeperProductFIlterParams?.tissueId) {
      const selectedTissue = tissueData?.tissueList?.find((el) =>
        el?.id === storekeeperStore.storekeeperProductFIlterParams?.tissueId);

      setTissueColors(selectedTissue?.tissueColors as any);
    }

    if (storekeeperStore.storekeeperProductFIlterParams?.categoryId) {
      const selectedCategory = categoryData?.categoryList?.find((el) =>
        el?.id === storekeeperStore.storekeeperProductFIlterParams?.categoryId);

      setCategoryModels(selectedCategory?.models as any);
    }

    form.setFieldsValue({
      ...storekeeperStore.storekeeperProductFIlterParams,
    });
  }, [storekeeperStore.isOpenStorekeeperMainFilterModal]);


  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperMainFilterModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        // confirmLoading={modalLoading}
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
              options={categoryOptions}
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
              options={allModelsOptions}
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
              options={allDirectionsOptions}
              filterOption={filterOption}
              loading={directionLoading}
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
              options={tissueOptions}
              loading={tissueLoading}
              optionFilterProp="children"
              notFoundContent={tissueLoading ? <Spin size="small" /> : null}
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
          {status &&
          <Form.Item
            label="Статус"
            name="statusId"
            style={{width: '100%'}}
          >
            <Select
              allowClear
              options={productStatusOptions}
              filterOption={filterOption}
              optionFilterProp="children"
              loading={productStatusDataLoading}
              placeholder="Статус"
            />
          </Form.Item>}
        </Form>
      </Modal>
    </>
  );
});
