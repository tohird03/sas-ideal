import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {FilterOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Breadcrumb, Button, Input} from 'antd';
import classNames from 'classnames';
import {useMediaQuery} from 'usehooks-ts';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {ROUTES} from '@/constants';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {storekeeperAddProductBasketColumn} from '../constants';
import {StorekeeperAddProductBasketModal} from '../StorekeeperAddProductBasketModal/StorekeeperAddProductBasketModal';
import styles from '../storekeeperMain.scss';
import {StorekeeperMainProductFilterModal} from
  '../StorekeeperMainProductFilterModal/StorekeeperMainProductFilterModal';

const cn = classNames.bind(styles);

export const StorekeeperAddProductBasket = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const navigate = useNavigate();
  const handlePageChange = (page: number, pageSize: number | undefined) => {
    storekeeperStore.setPageNumber(page);
    storekeeperStore.setPageSize(pageSize!);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    storekeeperStore.setSearch(e.target.value.trim());
  };

  const {data: products, isLoading: productsLoading} = useQuery({
    queryKey: ['getProducts',
      storekeeperStore.pageSize,
      storekeeperStore.pageNumber,
      storekeeperStore.search,
      storekeeperStore.storekeeperProductFIlterParams],
    queryFn: () => storekeeperApi.getProducts(
      {
        pageSize: storekeeperStore.pageSize,
        pageNumber: storekeeperStore.pageNumber,
        ...storekeeperStore.storekeeperProductFIlterParams,
        ...(storekeeperStore.search?.length && {name: storekeeperStore.search}),
        ...(storekeeperStore.search?.length && {modelName: storekeeperStore.search}),
      }
    ),
  });

  const handleOpenFilterModal = () => {
    storekeeperStore.setIsOpenStorekeeperMainFilterModal(true);
  };

  useEffect(() => {
    storekeeperStore.setSearch('');
    storekeeperStore.setStorekeeperProductFIlterParams(null);
  }, [window.location.pathname]);

  return (
    <>
      <main>
        <Breadcrumb
          style={{marginBottom: '20px'}}
          separator="/"
          items={[
            {
              title: 'Главный',
            },
            {
              title: <Link to={ROUTES.storekeeperMain}>Домой</Link>,
            },
            {
              title: 'Новый продукт',
            },
          ]}
        />
        <div className={cn('storekeeperAddBasketHeader')}>
          <Button
            onClick={handleOpenFilterModal}
          >
            Фильтр <FilterOutlined />
          </Button>
          <Button
            onClick={() => navigate(ROUTES.storekeeperBasket)}
            icon={<ShoppingCartOutlined />}
          />
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('storekeeperSearchInput')}
          />
        </div>
        <DataTable
          columns={storekeeperAddProductBasketColumn}
          data={products?.productList || []}
          loading={productsLoading}
          isMobile={isMobile}
          pagination={{
            total: products?.count,
            current: storekeeperStore.pageNumber,
            pageSize: storekeeperStore.pageSize,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(products?.count),
          }}
        />

        {storekeeperStore.isOpenStorekeeperAddProductBasketModal
        && <StorekeeperAddProductBasketModal />}
        {storekeeperStore.isOpenStorekeeperMainFilterModal
        && <StorekeeperMainProductFilterModal status={false} />}
      </main>
    </>

  );
});
