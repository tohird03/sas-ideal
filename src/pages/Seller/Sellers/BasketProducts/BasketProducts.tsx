import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Button, Typography} from 'antd';
import classnamesBind from 'classnames/bind';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {courierStores} from '@/stores/dms';
import {sellerStore} from '@/stores/seller';
import {useMediaQuery} from '@/utils/mediaQuery';
import styles from './bascket-products.scss';
import {ClientInfoModal} from './ClientInfoModal';
import {sellerSaleProductsColumns} from './constants';
import {FilterModal} from './FilterModal';
import {PaymentModal} from './PaymentModal';
import {ProductUpdateModal} from './ProductUpdateModal';

const cn = classnamesBind.bind(styles);

export const BasketProducts = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: sellerBasketProductsData, isLoading: loading} = useQuery({
    queryKey: ['getBasketProducts'],
    queryFn: () =>
      sellerSaleAndOrderApi.getBasketProducts({}),
  });

  const handleOpenClientInfoModal = () => {
    sellerStore.setIsOpenSellerClentInfoModal(true);
  };

  return (
    <>
      {/* <FilterHeader /> */}
      <Typography.Title level={3}>Корзинка</Typography.Title>
      <DataTable
        columns={sellerSaleProductsColumns(true)}
        data={sellerBasketProductsData || []}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
      />

      <Button
        onClick={handleOpenClientInfoModal}
        type="primary"
        className={cn('sellerMyOrdersSubmitButton')}
      >
        Сохранить
      </Button>

      {sellerStore.isOpenSellerFilterModal && <FilterModal />}
      {sellerStore.isOpenSellerPaymentModal && <PaymentModal />}
      {sellerStore.isOpenSellerClentInfoModal && <ClientInfoModal />}
      {sellerStore.isOpenBasketProductUpdateModal && <ProductUpdateModal />}
    </>
  );
});
