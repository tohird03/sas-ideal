import React from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Typography} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ChangeStatusModal} from './ChangeStatusModal';
import {ChooseWarehouseModal} from './ChooseWarehouseModal';
import {mainStorekeeperProductListColumns} from './constants';

export const MainStorekeeperCart = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: cartProductListData, isLoading: loading} = useQuery({
    queryKey: ['getCartProductList',
      mainStorekeeperStore.cartProductPageSize,
      mainStorekeeperStore.cartProductPageNumber],
    queryFn: () =>
      mainStorekeeperStore.getCartProduct({
        pageSize: mainStorekeeperStore.cartProductPageSize,
        pageNumber: mainStorekeeperStore.cartProductPageNumber,
      }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    mainStorekeeperStore.setCartProductPageSize(pageSize!);
    mainStorekeeperStore.setCartProductPageNumber(page);
  };

  const handleOpenChooseWarehouseModal = () => {
    mainStorekeeperStore.setIsOpenCartChooseWarehouseModal(true);
  };

  return (
    <>
      <Typography.Title level={3}>
        Корзина
      </Typography.Title>

      <DataTable
        loading={loading}
        columns={mainStorekeeperProductListColumns}
        data={cartProductListData?.cartList || []}
        isMobile={isMobile}
        pagination={{
          total: cartProductListData?.count,
          current: cartProductListData?.pageNumber,
          pageSize: cartProductListData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(cartProductListData?.count),
        }}
      />

      <Button onClick={handleOpenChooseWarehouseModal} icon={<PlusOutlined />}>Создать продукт</Button>

      {mainStorekeeperStore.isOpenChangeStatusCartProduct && <ChangeStatusModal />}
      {mainStorekeeperStore.isOpenCartChooseWarehouseModal && <ChooseWarehouseModal />}
    </>
  );
});
