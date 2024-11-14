import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {IGetCategoryList} from '@/api/categories/types';
import {IAddModel} from '@/api/model/types';
import {categoriesStore} from '@/stores/categories';
import {modelStore} from '@/stores/model';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddModelModal = observer(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [categoryData, setCategoryData] = useState<IGetCategoryList[]>([]);
  const [treeSelectData, setTreeSelectData] = useState<any>([]);


  const {mutate: addModel} =
    useMutation({
      mutationKey: ['addModel'],
      mutationFn: (params: IAddModel) =>
        modelStore.addModel({...params, categoryId: categoriesStore.subCategoryId}),
      onSuccess: (res) => {
        if (res?.status === 204) {
          queryClient.invalidateQueries({queryKey: ['getModel']});
          handleModalClose();
        }
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateModel} =
    useMutation({
      mutationKey: ['updateModel'],
      mutationFn: (params: IAddModel) => modelStore.updateModel(params),
      onSuccess: (res) => {
        if (res?.status === 204) {
          queryClient.invalidateQueries({queryKey: ['getModel']});
          handleModalClose();
        }
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });


  const {data: subCategoryData, isPending: subCategoryLoading} = useQuery({
    queryKey: ['getSubCategory'],
    queryFn: () => categoriesStore.getSubCategory(),
  });

  const onChangeTree = (categoryId: string | null) => {
    categoriesStore.setSubCategoryId(categoryId);
  };


  const handleSubmit = (value: IAddModel) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (modelStore.singleModel) {
      updateModel({
        ...trimmedObject,
        id: modelStore?.singleModel?.id,
        categoryId: categoriesStore.subCategoryId,
      });

      return;
    }

    addModel(trimmedObject);
  };

  const handleModalClose = () => {
    modelStore.setSingleModel(null);
    modelStore.setIsOpenNewModel(false);
    categoriesStore.setSubCategoryId(null);
  };

  const handleModalOk = () => {
    form.submit();
  };

  function check(categories: IGetCategoryList[], sub: IGetCategoryList) {
    const subNewCategory = insertCategoryToParent(categories, sub);

    for (let i = 0; i < subNewCategory.length; i++) {
      if (Object.keys(subNewCategory[i])?.includes('subcategories')) {
        check(subNewCategory[i].subcategories || [], sub);
      }
    }

    return subNewCategory;
  }

  function insertCategoryToParent(categories: IGetCategoryList[], sub: IGetCategoryList) {
    for (let i = 0; i < categories.length; i++) {
      if (!Object.keys(categories[i]).includes('subcategories') && categories[i].id === sub.id) {
        categories[i] = sub;
      }
    }

    return categories;
  }

  const formatChildCategory: any = (data: IGetCategoryList[], pId?: string) =>
    data?.map((category) => ({
      id: category?.id,
      title: `${category?.title}`,
      value: category?.id,
      pId: pId || 0,
      children: category.subcategories ? formatChildCategory(category.subcategories, category?.id) : [],
      data: category,
      isLeaf: category.subcategories?.length === 0,
    }));


  useEffect(() => {
    if (modelStore.singleModel) {
      form.setFieldsValue(modelStore.singleModel);
      form.setFieldValue('categoryId', modelStore?.singleModel?.category?.id);
    }
  }, [modelStore.singleModel]);

  useEffect(() => {
    if (subCategoryData) {
      setCategoryData(subCategoryData?.categoryList);
      setTreeSelectData(formatChildCategory(subCategoryData?.categoryList));
    }
  }, [subCategoryData]);

  const subCategoryOptions = useMemo(
    () =>
      subCategoryData?.categoryList?.map((t, i) => ({
        value: t?.id || '',
        label: t?.title || '',
        key: i,
      })),
    [subCategoryData]
  );

  const filterOption = (
    input: string,
    option?: {label: string, value: string}
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase().trim());

  return (
    <Modal
      open={modelStore.isOpenNewModel}
      title={modelStore.singleModel ? 'Изменить модель' : 'Новый модель'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Название модели"
          rules={[{required: true}]}
        >
          <Input placeholder="Название модели" />
        </Form.Item>
        <Form.Item
          name="qtyPerDay"
          label="Количество в день"
          rules={[{required: true}]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="Количество в день"
          />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Категория"
          rules={[{required: true}]}
        >
          <Select
            showSearch
            placeholder="Выбирать..."
            loading={subCategoryLoading}
            options={subCategoryOptions}
            filterOption={filterOption}
            optionFilterProp="children"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
