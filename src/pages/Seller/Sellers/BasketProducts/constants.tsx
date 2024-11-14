import React from 'react';
import {Badge, ColorPicker, Image, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {ISellerBasketProducts, ISellerProductSalePayments} from '@/api/seller/sellerSaleAndOrder/types';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';
import {PaymentAction} from './PaymentModal/PaymentAction';

export const sellerSaleProductsColumns = (isShowActionCol: boolean) => {
  const productInBasketColumns: ColumnType<ISellerBasketProducts>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '№',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID товара',
      align: 'center',
      render: (value, record) => record?.product?.partId,
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Продукт',
      align: 'center',
      render: (value, record) => (
        <div style={{display: 'flex', gap: '10px'}}>
          {record?.product?.images?.length > 0 && (
            <Image
              src={`${imgStages?.apiUrl}${record?.product?.images[0]}`}
              width={80}
              height={40}
            />
          )}
          <div>
            <Typography.Title style={{margin: 0, textAlign: 'left'}} level={5}>
              {record?.product?.name} - {record?.product?.category?.title}
            </Typography.Title>
            <Typography.Text>
              {record?.product?.model?.name} - {record?.product?.direction?.title}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'tissue',
      dataIndex: 'tissue',
      title: 'Ткань',
      align: 'center',
      render: (value, record) => (
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          {record?.product?.tissue ? (
            <>
              <div>
                <Typography.Title
                  style={{margin: 0, textAlign: 'left'}}
                  level={5}
                >
                  {record?.product?.tissue?.tissue?.name}
                </Typography.Title>
                <Typography.Text>
                  {record?.product?.tissue?.name}
                </Typography.Text>
              </div>
              <ColorPicker
                value={record?.product?.tissue?.hexColor}
                disabled
              />
            </>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: 'Цена',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.product?.oldPriceFactor?.retailPrice || 0)} сум</span>,
    },
    {
      key: 'priceWithSale',
      dataIndex: 'priceWithSale',
      title: 'Цена со скидкой',
      align: 'center',
      render: (value, record) => {
        const oldPriceFactor = record?.product?.oldPriceFactor;
        const price = oldPriceFactor?.retailPrice || 0;
        const sale = record?.product?.promotion || 0;
        const sellerSale = record?.product?.fixForSeller || 0;
        const priceWithSale = priceFormat((price - ((price * (sale + sellerSale)) / 100)));

        return <span>{priceWithSale} сум</span>;
      },
    },
    {
      key: 'discount',
      dataIndex: 'discount',
      title: 'Скидка',
      align: 'center',
      render: (value, record) => (
        <Badge color="red" count={`${record?.product?.promotion || 0} %`} />
      ),
    },
    {
      key: 'fixForSeller',
      dataIndex: 'fixForSeller',
      title: 'Доп. скидка',
      align: 'center',
      render: (value, record) => (
        <Badge color="red" count={`${record?.product?.fixForSeller || 0} %`} />
      ),
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Количество',
      align: 'center',
      render: (value, record) => <span>{record?.quantity} шт</span>,
    },
    {
      key: 'sum',
      dataIndex: 'sum',
      title: 'Сумма',
      align: 'center',
      render: (value, record) => {
        const oldPriceFactor = record?.product?.oldPriceFactor;
        const price = oldPriceFactor?.retailPrice || 0;
        const sale = record?.product?.promotion || 0;
        const sellerSale = record?.product?.fixForSeller || 0;
        const allSale = sale + sellerSale;
        const finalPrice = (price - (price * allSale) / 100) * record?.quantity;

        return <span>{priceFormat(finalPrice)} сум</span>;
      },
    },
  ];

  if (isShowActionCol) {
    productInBasketColumns.push({
      key: 'action',
      dataIndex: 'action',
      title: 'Действия',
      align: 'center',
      render: (value, record) => <Action product={record} />,
    });
  }

  return productInBasketColumns;
};

export const sellerSalePaymentColumns = (isShowActionCol: boolean) => {
  const productSalePaymentsColumns: ColumnType<ISellerProductSalePayments>[] = [
    {
      title: 'Тип оплата',
      key: 'paymentType',
      dataIndex: 'paymentType',
      render: (value, record) => <span>{record?.paymentType}</span>,
    },
    {
      title: 'Оплата.сум',
      key: 'usz',
      dataIndex: 'usz',
      render: (value, record) => <span>{priceFormat(record?.uzs)}</span>,
    },
    {
      title: 'Оплата. $',
      key: 'uzd',
      dataIndex: 'uzd',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.usd)}</span>,
    },
    {
      title: 'Курс-$ 100',
      key: 'course',
      dataIndex: 'course',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.course)}</span>,
    },
    {
      title: 'Сумма по курсу',
      key: 'uzsByCourse',
      dataIndex: 'uzsByCourse',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.uzsByCourse)}</span>,
    },
    {
      title: 'Здачи',
      key: 'rest',
      dataIndex: 'rest',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.rest)}</span>,
    },
    {
      title: 'Итого',
      key: 'totalSum',
      dataIndex: 'totalSum',
      align: 'center',
      render: (value, record) => <span>{priceFormat(record?.totalSum)}</span>,
    },
    {
      title: 'Загаловок',
      key: 'description',
      dataIndex: 'description',
      align: 'center',
      render: (value, record) => <span>{record?.description || '-'}</span>,
    },
  ];

  if (isShowActionCol) {
    productSalePaymentsColumns.push({
      title: 'Дествия',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (value, record) => <PaymentAction payment={record} />,
    });
  }

  return productSalePaymentsColumns;
};
