import React from 'react';
import {ColorPicker, Image, TabsProps, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {IGetSingleOrder, ISaleOrderProduct, ISaleOrderProductStatus} from '@/api/orders/types';
import {
  ISellerProductSalePayments,
  ISellerSalePayment,
} from '@/api/seller/sellerSaleAndOrder/types';
import {EMyOrdersTabs} from '@/stores/seller/seller/orders/orders';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import {OrderInfo} from './OrderInfo';
import {OrderPayment} from './OrderPayments';
import {OrderProducts} from './OrderProducts';

export const singleOrderInfoTabs: TabsProps['items'] = [
  {
    key: EMyOrdersTabs.Client,
    label: 'Инфо',
    children: <OrderInfo />,
  },
  {
    key: EMyOrdersTabs.Products,
    label: 'Продукты',
    children: <OrderProducts />,
  },
  {
    key: EMyOrdersTabs.Payments,
    label: 'Оплаты',
    children: <OrderPayment />,
  },
];

export const orderInfoColumns: ColumnType<IGetSingleOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Клиент',
    align: 'center',
    render: (value, record) => (
      <>
        <Typography.Title
          style={{margin: 0}}
          level={5}
        >
          {record?.client?.name}
        </Typography.Title>
        <Typography.Text>
          +{record?.client?.phone}
        </Typography.Text>
      </>
    ),
  },
  {
    key: 'from',
    dataIndex: 'from',
    title: 'Откуда пришёл',
    align: 'center',
    render: (value, record) => record?.client?.clientFrom?.name,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag>
        {record?.status}
      </Tag>
    ),
  },
  {
    key: 'deadline',
    dataIndex: 'deadline',
    title: 'Срок доставки',
    align: 'center',
    render: (value, record) => <span>{getFullDateFormat(record?.deliveryDate)}</span>,
  },
  {
    key: 'adress',
    dataIndex: 'adress',
    title: 'Адрес',
    align: 'center',
    render: (value, record) => record?.client?.address,
  },
];

export const orderProductsColumns: ColumnType<ISaleOrderProduct>[] = [
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
    render: (value, record, index) => '0123321',
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.product?.images && record?.product?.images![0] &&
          <Image src={`${imgStages?.apiUrl}${record?.product?.images[0]}`} width={80} height={60} />
        }
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.product?.name} - {record?.product?.category?.title}
          </Typography.Title>
          <Typography.Text>{record?.product?.model?.name} - {record?.product?.direction?.title}</Typography.Text>
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
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.product?.tissueColor?.tissue?.name}
          </Typography.Title>
          <Typography.Text>{record?.product?.tissueColor?.name}</Typography.Text>
        </div>
        <ColorPicker value={record?.product?.tissueColor?.hexColor} disabled />
      </div>
    ),
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Цена',
    align: 'center',
    render: (value, record) => `${priceFormat(record?.price)} сум`,
  },
  {
    key: 'salePrice',
    dataIndex: 'salePrice',
    title: 'Цена со скидкой',
    align: 'center',
    render: (value, record) => `${priceFormat(record?.finalPrice)} сум`,
  },
  {
    key: 'saleAndDopSale',
    dataIndex: 'saleAndDopSale',
    title: 'Скидка + Доп. скидка',
    align: 'center',
    width: 120,
    render: (value, record) => `${record?.sale + record?.fixForSeller}%`,
  },
  {
    key: 'qty',
    dataIndex: 'qty',
    title: 'Количество',
    align: 'center',
    render: (value, record) => <span>{record?.quantity} шт</span>,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value, record) => (
      <Tag color={myOrderProductStatusColor[record?.status]}>
        {record?.status}
      </Tag>
    ),
  },
  {
    key: 'priceBySum',
    dataIndex: 'priceBySum',
    title: 'Сумма',
    align: 'center',
    render: (value, record) => `${priceFormat(record?.finalPrice * record?.quantity)} сум`,
  },
];

export const orderPaymentsColumns: ColumnType<ISellerSalePayment>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Вид оплаты',
    align: 'center',
    render: (value, record) => record?.paymentType,
  },
  {
    key: 'priceDollor',
    dataIndex: 'priceDollor',
    title: 'Доллар$',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.usd)}$</span>,
  },
  {
    key: 'priceSum',
    dataIndex: 'priceSum',
    title: 'Доллар в Сум',
    align: 'center',
    render: (value, record) => {
      const uzsByCourse = ((record?.course || 0) / 100) * record?.usd;

      return (
        <span>
          {priceFormat(uzsByCourse)} сум
        </span>
      );
    },
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Сумма платежей',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.totalSum)} сум</span>,
  },
  {
    key: 'rest',
    dataIndex: 'rest',
    title: 'Сдачи',
    align: 'center',
    render: (value, record) => <span>{priceFormat(record?.rest)} сум</span>,
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: 'Дата оплаты',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt!),
  },
];

export const productSalePaymentsColumns: ColumnType<ISellerProductSalePayments>[] = [
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

export const myOrderProductStatusColor: Record<ISaleOrderProductStatus, string> = {
  [ISaleOrderProductStatus.Canceled]: '#ff0000',
  [ISaleOrderProductStatus.Success]: '#008000',
  [ISaleOrderProductStatus.Pending]: '#FFA500',
};
