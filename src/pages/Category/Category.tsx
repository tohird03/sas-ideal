import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {categoriesStore} from '@/stores/categories';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddCategoryModal} from './AddCategoryModal';
import styles from './category.scss';
import {categoriesColumns} from './constants';

const cn = classNames.bind(styles);

export const Categories = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data, isLoading: loading} = useQuery({
    queryKey: ['getCategory', categoriesStore.page, categoriesStore.limit, categoriesStore.search],
    queryFn: () =>
      categoriesStore.getCategory({
        pageNumber: categoriesStore.page,
        pageSize: categoriesStore.limit,
        title: categoriesStore.search,
      }),
  });

  const handleAddCategory = () => {
    categoriesStore.setIsOpenNewCategoryModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    categoriesStore.setSearch(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    categoriesStore.setPage(page);
    categoriesStore.setLimit(pageSize!);
  };


  useEffect(() => () => {
    categoriesStore.setSearch('');
  }, []);

  return (
    <main>
      <div className={cn('categories__head')}>
        <Typography.Title level={3}>Категории</Typography.Title>
        <div className={cn('categories__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('categories__search')}
          />
          {/* <Button
            onClick={handleAddCategory}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новая категория
          </Button> */}
        </div>
      </div>

      <DataTable
        columns={categoriesColumns}
        data={data?.categoryList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: data?.count,
          current: categoriesStore?.page,
          pageSize: categoriesStore?.limit,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(data?.count),
        }}
      />
      {categoriesStore.isOpenNewCategoryModal && <AddCategoryModal />}
    </main>
  );
});
