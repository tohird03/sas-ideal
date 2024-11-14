import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal, TreeSelect, TreeSelectProps} from 'antd';
import {IAddCategory, IGetCategoryList} from '@/api/categories/types';
import {categoriesStore} from '@/stores/categories';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddCategoryModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [treeSelectData, setTreeSelectData] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<IGetCategoryList[]>([]);

  const onChangeTree = (categoryId: string | null) => {
    categoriesStore.setSubCategoryId(categoryId!);
  };

  const {data: subCategoryData} = useQuery({
    queryKey: ['getSubCategory'],
    queryFn: () => categoriesStore.getSubCategory(),
  });

  const {mutate: addCategory} =
    useMutation({
      mutationKey: ['addCategory'],
      mutationFn: (params: IAddCategory) =>
        categoriesStore.addCategory({...params, categoryId: categoriesStore.subCategoryId}),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCategory']});
        handleModalClose();
        categoriesStore.setSubCategoryId(null);
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateCategory} =
    useMutation({
      mutationKey: ['updateCategory'],
      mutationFn: (params: IAddCategory) => categoriesStore.uptadeCategory(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCategory']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddCategory) => {
    setLoading(true);

    const trimmedObject = trimValues(value);


    if (categoriesStore.singleCategory) {
      updateCategory({
        id: categoriesStore?.singleCategory?.id,
        title: trimmedObject.title,
      });

      return;
    }

    addCategory({
      title: trimmedObject.title,
    });
  };

  const handleModalClose = () => {
    categoriesStore.setSingleCategory(null);
    categoriesStore.setIsOpenNewCategoryModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  function check(categories: IGetCategoryList[], sub: IGetCategoryList){
    const subNewCategory = insertCategoryToParent(categories, sub);

    for (let i = 0; i<subNewCategory.length; i++) {
      if (Object.keys(subNewCategory[i])?.includes('subcategories')){
        check(subNewCategory[i].subcategories || [], sub);
      }
    }

    return subNewCategory;
  }

  function insertCategoryToParent(categories: IGetCategoryList[], sub: IGetCategoryList){
    for (let i = 0; i < categories.length; i++){
      if (!Object.keys(categories[i]).includes('subcategories') && categories[i].id === sub.id){
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

  const onLoadData: TreeSelectProps['loadData'] = (data) =>
    new Promise((resolve) => {
      if (data?.data?.subcategories) {
        resolve(undefined);

        return;
      }

      categoriesStore
        .getSubCategoryWithSubs(data?.data?.id)
        .then((res) => {
          if (res) {
            if (res?.subcategories) {
              setCategoryData(check(categoryData, res));
              setTreeSelectData(formatChildCategory(check(categoryData, res)));
            }

          }
        })
        .catch(addNotification)
        .finally(() => {
          resolve(undefined);
        });
    });

  useEffect(() => {
    if (categoriesStore.singleCategory) {
      form.setFieldsValue(categoriesStore.singleCategory);
    }
  }, [categoriesStore.singleCategory]);

  useEffect(() => {
    if (subCategoryData) {
      setCategoryData(subCategoryData?.categoryList);
      setTreeSelectData(formatChildCategory(subCategoryData?.categoryList));
    }
  }, [subCategoryData]);

  return (
    <Modal
      open={categoriesStore.isOpenNewCategoryModal}
      title={categoriesStore.singleCategory ? 'Изменить категория' : 'Новая категория'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Сохранить"
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
          name="title"
          label="Название категории"
          rules={[{required: true}]}
        >
          <Input placeholder="Название категории" />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Выбор дерева"
        >
          <TreeSelect
            showSearch
            style={{width: '100%'}}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="Выбирать..."
            allowClear
            // treeDefaultExpandAll
            treeDataSimpleMode
            onChange={onChangeTree}
            treeData={subCategoryData ? treeSelectData : []}
            loadData={onLoadData}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
});
