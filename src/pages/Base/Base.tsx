import React, {useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, TreeSelect, TreeSelectProps, Typography} from 'antd';
import classNames from 'classnames';
import {IGetCategoryList} from '@/api/categories/types';
import {DataTable} from '@/components/Datatable/datatable';
import {basesStore} from '@/stores/base/base';
import {categoriesStore} from '@/stores/categories';
import {addNotification} from '@/utils';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddBasesModal} from './AddBase';
import styles from './base.scss';
import {basesColumns} from './constants';

const cn = classNames.bind(styles);

export const Base = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [value, setValue] = useState<string>();
  const [treeSelectData, setTreeSelectData] = useState<any>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);


  const handleAddBase = useCallback(() => {
    basesStore.setIsOpenAddBaseModal(true);
    basesStore.editBase = null;
  }, []);

  // const {data: subCategoryData} = useQuery({
  //   queryKey: ['getSubCategory'],
  //   queryFn: () => categoriesStore.getSubCategory(),
  // });

  const {data: subCategoryData} = useQuery({
    queryKey: ['baseCategoryGet'],
    queryFn: () => basesStore.baseCategoryGet(),
  });

  const {data: basesData, isLoading: loading} = useQuery({
    queryKey: [
      'getBases',
      basesStore.name,
      basesStore.pageSize,
      basesStore.pageNumber,
      basesStore.baseCategoryId,
    ],
    queryFn: () =>
      basesStore.getBases({
        name: basesStore.name,
        pageSize: basesStore.pageSize,
        pageNumber: basesStore.pageNumber,
        baseCategoryId: basesStore.baseCategoryId!,
      }),
  });

  const handlePageChange = useCallback(
    (page: number, pageSize: number | undefined) => {
      basesStore.setPageNumber(page);
      basesStore.setPageSize(pageSize!);
    },
    []
  );

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    basesStore.setName(e.currentTarget.value.trim());
  };

  function check(categories: any[], sub: any){
    const subNewCategory = insertCategoryToParent(categories, sub);

    for (let i = 0; i<subNewCategory.length; i++) {
      if (Object.keys(subNewCategory[i])?.includes('subcategories')){
        check(subNewCategory[i].subcategories || [], sub);
      }
    }

    return subNewCategory;
  }

  function insertCategoryToParent(categories: any[], sub: any){
    for (let i = 0; i < categories.length; i++){
      if (!Object.keys(categories[i]).includes('subcategories') && categories[i].id === sub.id){
        categories[i] = sub;
      }
    }

    return categories;
  }

  const formatChildCategory: any = (data: any[], pId?: string) =>
    data?.map((category) => ({
      id: category?.id,
      title: `${category?.name}`,
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
    basesStore.setBaseCategoryId(categoryId!);
  };

  useEffect(() => {
    if (subCategoryData) {
      setCategoryData(subCategoryData?.baseCategoryList);
      setTreeSelectData(formatChildCategory(subCategoryData?.baseCategoryList));
    }
  }, [subCategoryData]);

  useEffect(() => () => {
    basesStore.setSearch('');
  }, []);

  return (
    <>
      <main>
        <div className={cn('base__head')}>
          <Typography.Title level={3}>База</Typography.Title>
          <div className={cn('base__filter')}>
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
              placeholder="Поиск пользователей"
              allowClear
              onChange={handleSearch}
              className={cn('base__search')}
            />

            <Button
              onClick={handleAddBase}
              type="primary"
              icon={<PlusOutlined />}
            >
              Новая база
            </Button>
          </div>
        </div>

        <DataTable
          columns={basesColumns}
          data={basesData?.baseList || []}
          loading={loading}
          isMobile={isMobile}
          pagination={{
            total: basesData?.count,
            current: basesData?.pageNumber,
            pageSize: basesData?.pageSize,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(basesData?.count),
          }}
        />
        {basesStore.isOpenAddBaseModal && <AddBasesModal />}
      </main>
    </>
  );
});
