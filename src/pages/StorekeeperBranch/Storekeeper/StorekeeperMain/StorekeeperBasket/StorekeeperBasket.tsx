import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {QueryClient, useMutation, useQuery} from '@tanstack/react-query';
import {Breadcrumb, Button} from 'antd';
import classNames from 'classnames';
import {useMediaQuery} from 'usehooks-ts';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {ROUTES} from '@/constants';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {storekeeperBasketColumn} from '../constants';
import {StorekeeperEditStatusBasketModal} from '../StorekeeperEditStatusBasketModal/StorekeeperEditStatusBasketModal';
import styles from '../storekeeperMain.scss';
import {StorekeeperMainProductFilterModal} from
  '../StorekeeperMainProductFilterModal/StorekeeperMainProductFilterModal';

const cn = classNames.bind(styles);

export const StorekeeperBasket = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const handlePageChange = (page: number, pageSize: number | undefined) => {
    storekeeperStore.setPageNumber(page);
    storekeeperStore.setPageSize(pageSize!);
  };

  const {data: cartProducts, isLoading: cartProductsLoading} = useQuery({
    queryKey: ['getCartProducts'],
    queryFn: () => storekeeperApi.getProductsCart(
      {
        pageNumber: storekeeperStore.pageNumber,
        pageSize: storekeeperStore.pageSize,
      }
    ),
  });

  const {mutate: submitProducts} = useMutation({
    mutationFn: () =>
      storekeeperApi.submitProducts(),
    onSuccess: () => {
      addNotification('Успешно завершено');
      queryClient.invalidateQueries({queryKey: ['getCartProducts']});
      navigate(ROUTES.storekeeperMain);
    },
    onError: addNotification,
  });


  const handleSubmit = () => {
    submitProducts();
  };

  // const handleOpenFilterModal = () => {
  //   storekeeperStore.setIsOpenStorekeeperMainFilterModal(true);
  // };

  return (
    <>
      <main className={cn('basketPage')}>
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
              title: <Link to={ROUTES.storekeeperAddProductBasket}>Новый продукт</Link>,
            },
            {
              title: 'Корзинка',
            },
          ]}
        />
        {/* <div className={cn("storekeeperAddBasketHeader")}>
          <Button
            onClick={handleOpenFilterModal}
          >
            Фильтр <FilterOutlined />
          </Button>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn("storekeeperSearchInput")}
          />
        </div> */}

        <DataTable
          columns={storekeeperBasketColumn}
          data={cartProducts?.cartList || []}
          loading={cartProductsLoading}
          isMobile={isMobile}
          pagination={{
            total: cartProducts?.count,
            current: storekeeperStore.pageNumber,
            pageSize: storekeeperStore.pageSize,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(cartProducts?.count),
          }}
        />


        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          className={cn('sumbitProductsFixedBtn')}
        >Сохранить
        </Button>
        {storekeeperStore.isOpenStorekeeperMainFilterModal
          && <StorekeeperMainProductFilterModal status={false} />}

        {storekeeperStore.isOpenStorekeeperEditStatusBasketModal
        && <StorekeeperEditStatusBasketModal />}
      </main>
    </>
  );
});
