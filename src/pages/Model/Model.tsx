import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, TreeSelect, TreeSelectProps, Typography} from 'antd';
import classNames from 'classnames';
import {IGetCategoryList} from '@/api/categories/types';
import {DataTable} from '@/components/Datatable/datatable';
import {categoriesStore} from '@/stores/categories';
import {modelStore} from '@/stores/model';
import {addNotification} from '@/utils';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddModelModal} from './AddModel';
import {modelColumns} from './constants';
import styles from './model.scss';

const cn = classNames.bind(styles);

export const Model = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [treeSelectData, setTreeSelectData] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<IGetCategoryList[]>([]);
  const [value, setValue] = useState<string>();


  const {data: model, isLoading: loading} = useQuery({
    queryKey: ['getModel', modelStore.modelCategoryId, modelStore.page, modelStore.limit, modelStore.search],
    queryFn: () =>
      modelStore.getModel({
        pageNumber: modelStore.page,
        pageSize: modelStore.limit,
        name: modelStore.search,
        categoryId: modelStore.modelCategoryId!,
      }),
  });

  const {data: subCategoryData} = useQuery({
    queryKey: ['getSubCategory'],
    queryFn: () => categoriesStore.getSubCategory(),
  });


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

  const onChangeTree = (categoryId: string | null) => {
    categoriesStore.setSubCategoryId(categoryId!);
    modelStore.setModelCategoryId(categoryId!);
  };


  const handleAddCategory = () => {
    modelStore.setIsOpenNewModel(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    modelStore.setSearch(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    modelStore.setPage(page);
    modelStore.setLimit(pageSize!);
  };

  useEffect(() => {
    if (subCategoryData) {
      setCategoryData(subCategoryData?.categoryList);
      setTreeSelectData(formatChildCategory(subCategoryData?.categoryList));
    }
  }, [subCategoryData]);

  useEffect(() => () => {
    modelStore.setSearch('');
  }, []);

  return (
    <main>
      <div className={cn('model__head')}>
        <Typography.Title level={3}>Модели</Typography.Title>
        <div className={cn('model__filter')}>
          <TreeSelect
            showSearch
            style={{width: '60%'}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="Выбирать..."
            allowClear
            // treeDefaultExpandAll
            treeDataSimpleMode
            onChange={onChangeTree}
            treeData={subCategoryData ? treeSelectData : []}
            loadData={onLoadData}
          />
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('model__search')}
          />
          {/* <Button
            onClick={handleAddCategory}
            type="primary"
            icon={<PlusCircleOutlined />}
            className={cn('model__add-button')}
          >
            Новая модель
          </Button> */}
        </div>
      </div>

      <DataTable
        columns={modelColumns}
        data={model?.modelList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: model?.count,
          current: modelStore?.page,
          pageSize: modelStore?.limit,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(model?.count),
        }}
      />

      {modelStore.isOpenNewModel && <AddModelModal />}
    </main>
  );
});
