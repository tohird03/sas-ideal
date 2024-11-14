import React from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {ArrowLeftOutlined, CheckOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Typography} from 'antd';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {useLocalStorage} from 'usehooks-ts';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISaleProducts, ISellerProductSalePayments, ISellerSaleClient, ISellerSalePayment} from '@/api/seller/sellerSaleAndOrder/types';
import {DataTable} from '@/components/Datatable/datatable';
import {ROUTES} from '@/constants';
import {sellerStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {useMediaQuery} from '@/utils/mediaQuery';
import {sellerSalePaymentColumns, sellerSaleProductsColumns} from '../constants';
import {saleClientColumns} from './constants';
import styles from './order-check-and-sale.scss';

const cn = classNames.bind(styles);

export const OrderCheckAndSalePage = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [sellerPaymentsLocal, setSellerPaymentsLocal] =
    useLocalStorage<ISellerProductSalePayments[]>('sellerPaymentsLocal', []);
  const [sellerClientLocal, setSellerClientLocal] =
    useLocalStorage<ISellerSaleClient | null>('sellerClientLocal', null);
  const [generatePartIdLocal, setGeneratePartIdLocal] = useLocalStorage<string | null>('partId', null);

  const {data: sellerBasketProductsData, isLoading: loading} = useQuery({
    queryKey: ['getBasketProducts'],
    queryFn: () =>
      sellerSaleAndOrderApi.getBasketProducts({}),
  });

  const {mutate: saleProducts} =
  useMutation({
    mutationKey: ['saleProducts'],
    mutationFn: (params: ISaleProducts) => sellerSaleAndOrderApi.saleProducts(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getBasketProducts']});
        addNotification('Пополнение успешно!');
        setSellerPaymentsLocal([]);
        setSellerClientLocal(null);
        setGeneratePartIdLocal(null);
        sellerStore.setIsOpenSellerClentInfoModal(false);
        sellerStore.setIsOpenSellerPaymentModal(false);
        handleBackToCart();
      }
    },
    onError: addNotification,
  });

  const handleBackToCart = () => {
    navigate(ROUTES.sellerBasketProducts);
  };

  const handleSale = () => {
    const salePayments = sellerPaymentsLocal?.map(payment => ({
      uzs: payment?.uzs,
      usd: payment?.usd,
      rest: payment?.rest,
      course: payment?.course,
      totalSum: payment?.totalSum,
      description: payment?.description,
      paymentType: payment?.paymentType,
    }));

    const products = sellerBasketProductsData?.map(baskteProduct => {
      const oldPriceFactor = baskteProduct?.product?.oldPriceFactor;
      const price = oldPriceFactor?.retailPrice || 0;
      const sale = baskteProduct?.product?.promotion || 0;
      const fixForSeller = baskteProduct?.product?.fixForSeller || 0;
      const allSale = sale + fixForSeller;
      const finalPrice = (price - ((price * allSale) / 100));
      const totalSum = finalPrice * baskteProduct?.quantity;

      return {
        id: baskteProduct?.product?.id,
        partId: baskteProduct?.product?.partId,
        price,
        finalPrice,
        sale,
        fixForSeller,
        totalSum,
        sellerPercent: oldPriceFactor?.sellerPercent!,
        quantity: baskteProduct?.quantity,
        sellerPercentSum: 0,
        wmsProductId: baskteProduct?.product?.id,
        fromWarehouse: baskteProduct?.product?.fromWarehouse,
      };
    });


    saleProducts({
      clientInfo: {...sellerClientLocal!, phone: `998${sellerClientLocal?.phone}`},
      payments: salePayments,
      products: products || [],
    });
  };

  return (
    <>
      <div style={{marginBottom: '30px'}}>
        <Typography.Title level={3}>Продукты</Typography.Title>
        <DataTable
          columns={sellerSaleProductsColumns(false)}
          data={sellerBasketProductsData || []}
          loading={loading}
          isMobile={isMobile}
          pagination={false}
        />
      </div>

      <div style={{marginBottom: '30px'}}>
        <Typography.Title level={3}>Статус и виды выплат</Typography.Title>
        <DataTable
          isMobile={isMobile}
          columns={sellerSalePaymentColumns(false)}
          data={sellerPaymentsLocal}
          pagination={false}
        />
      </div>

      <div style={{marginBottom: '30px'}}>
        <Typography.Title level={3}>Информация о клиенте</Typography.Title>
        <DataTable
          isMobile={isMobile}
          columns={saleClientColumns}
          data={[sellerClientLocal]}
          pagination={false}
        />
      </div>
      <div className={cn('sale__sale-btns-wrapper')}>
        <Typography.Title level={3}>Остаток: 9999999</Typography.Title>
        <div className={cn('sale__sale-btns')}>
          <Button
            type="primary"
            danger
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToCart}
          >
            Вернуться в Главное
          </Button>
          <Popconfirm
            title="Оформить"
            description="Вы уверены, что товары Оформить?"
            onConfirm={handleSale}
            okText="Оформить"
            okButtonProps={{style: {background: 'green'}}}
            cancelText="Нет"
          >
            <Button type="primary" icon={<CheckOutlined />}>
              Оформить
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
});
