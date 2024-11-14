import React from 'react';
import {ColorPicker, Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {EOrderDetailChangeType, IOrderDetailChange, ISingleOrderDetailChange} from '@/api/orders/types';
import {IPromotionProducts} from '@/api/promotion/types';
import {DataTableColumnsType} from '@/components/Datatable/datatable';
import {dateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';

export const changesProductsColumns: ColumnType<IOrderDetailChange>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'productId',
    dataIndex: 'productId',
    title: 'ID заказа',
    align: 'center',
    render: (value, record) => record?.partId,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.images && record?.images![0] &&
          <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={60} />
        }
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.name} - {record?.category?.title}
          </Typography.Title>
          <Typography.Text>{record?.model?.name} - {record?.direction?.title}</Typography.Text>
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
            {record?.tissue?.tissue?.name}
          </Typography.Title>
          <Typography.Text>{record?.tissue?.name}</Typography.Text>
        </div>
        <ColorPicker value={record?.tissue?.hexColor} disabled />
      </div>
    ),
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
    key: 'category',
    dataIndex: 'category',
    title: 'Категория',
    align: 'center',
    render: (value, record) => (
      <Tag color={orderDetailChangeRequestStatus[record?.type]}>
        {orderDetailChangeRequestStatusText[record?.type]}
      </Tag>
    ),
  },
  {
    key: 'deadline',
    dataIndex: 'deadline',
    title: 'Оформлено в',
    align: 'center',
    render: (value, record) => <span>{dateFormat(record?.createdAt)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Больше информации',
    align: 'center',
    render: (value, record) => <Action orderDetailChange={record} />,
  },
];


export const changeProductInfoRequestColumns: ColumnType<IOrderDetailChange>[] = [
  {
    key: 'productId',
    dataIndex: 'productId',
    title: 'ID',
    align: 'center',
    render: (value, record) => record?.partId,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
        {record?.images
          && <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={60} />
        }
        <div>
          <Typography.Title
            style={{margin: 0, textAlign: 'left'}}
            level={5}
          >
            {record?.name} - {record?.category?.title}
          </Typography.Title>
          <Typography.Text>{record?.model?.name} - {record?.direction?.title}</Typography.Text>
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
      <>
        {record?.tissue
          ? (
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <ColorPicker value={record?.tissue?.hexColor} disabled />
              <div>
                <Typography.Title
                  style={{margin: 0, textAlign: 'left'}}
                  level={5}
                >
                  {record?.tissue?.tissue?.name}
                </Typography.Title>
                <Typography.Text>{record?.tissue?.name}</Typography.Text>
              </div>
            </div>
          )
          : '-'
        }
      </>
    ),
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Цена',
    align: 'center',
    render: (value, record) => record?.price,
  },
  {
    key: 'sale',
    dataIndex: 'sale',
    title: 'Скидка',
    align: 'center',
    render: (value, record) => '0%',
  },
  {
    key: 'total',
    dataIndex: 'total',
    title: 'Итого',
    align: 'center',
    render: (value, record) => '13 620 000 сум',
  },
];

export const changeProductInfoColumnsForChangeRequest = (type: string) => {
  const bgStyles = () => (
    {
      ...(type === 'old' ? {
        backgroundColor: 'red',
      } : {
        backgroundColor: 'blue',
      }),
      padding: '5px',
      borderRadius: '4px',
      textStyle: {
        color: 'white',
      },
    }
  );

  const changeProductInfoRequestColumns: DataTableColumnsType<ISingleOrderDetailChange>[] = [
    {
      key: 'productId',
      dataIndex: 'productId',
      title: 'ID',
      align: 'center',
      render: (value, record) => record?.partId,
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Продукт',
      align: 'center',
      render: (value, record) => (
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          {record?.images
            && <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={60} />
          }
          <div>
            <Typography.Title
              style={{margin: 0, textAlign: 'left'}}
              level={5}
            >
              {record?.name} - {record?.category?.title}
            </Typography.Title>
            <Typography.Text>{record?.model?.name} - {record?.direction?.title}</Typography.Text>
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
        <>
          {record?.tissue
            ? (
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <ColorPicker value={record?.tissue?.hexColor} disabled />
                <div>
                  <Typography.Title
                    style={{margin: 0, textAlign: 'left'}}
                    level={5}
                  >
                    {record?.tissue?.tissue?.name}
                  </Typography.Title>
                  <Typography.Text>{record?.tissue?.name}</Typography.Text>
                </div>
              </div>
            )
            : '-'
          }
        </>
      ),
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: 'Цена',
      align: 'center',
      render: (value, record) => record?.price,
    },
    {
      key: 'sale',
      dataIndex: 'sale',
      title: 'Скидка',
      align: 'center',
      render: (value, record) => '0%',
    },
    {
      key: 'fixForSeller',
      dataIndex: 'fixForSeller',
      title: 'Доп. скидка',
      align: 'center',
      colStyle: (value, record) => (
        record?.oldValue?.fixForSeller !== record?.newWalue?.fixForSeller ? bgStyles() : {}
      ),
      render: (value, record) => (
        type === 'old'
          ? record?.oldValue?.fixForSeller
          : record?.newWalue?.fixForSeller
      ),
    },
    {
      key: 'salePrice',
      dataIndex: 'salePrice',
      title: 'Цена со скидкой',
      align: 'center',
      colStyle: (value, record) => (
        record?.oldValue?.finalPrice !== record?.newWalue?.finalPrice ? bgStyles() : {}
      ),
      render: (value, record) => (
        `${priceFormat(
          type === 'old'
            ? record?.oldValue?.finalPrice
            : record?.newWalue?.finalPrice
        )} сум`
      ),
    },
    {
      key: 'qty',
      dataIndex: 'qty',
      title: 'Количество',
      align: 'center',
      colStyle: (value, record) => (
        record?.oldValue?.quantity !== record?.newWalue?.quantity ? bgStyles() : {}
      ),
      render: (value, record) => (
        type === 'old'
          ? record?.oldValue?.quantity
          : record?.newWalue?.quantity
      ),
    },
    {
      key: 'totalPrice',
      dataIndex: 'totalPrice',
      title: 'Итого',
      align: 'center',
      colStyle: (value, record) => {
        const totalOldPrice = record?.oldValue?.quantity * record?.oldValue?.finalPrice;
        const totalNewPrice = record?.newWalue?.quantity * record?.newWalue?.finalPrice;

        return totalOldPrice !== totalNewPrice ? bgStyles() : {};
      },
      render: (value, record) => {
        const totalOldPrice = record?.oldValue?.quantity * record?.oldValue?.finalPrice;
        const totalNewPrice = record?.newWalue?.quantity * record?.newWalue?.finalPrice;

        return type === 'old' ? totalOldPrice : totalNewPrice;
      },
    },
  ];

  return changeProductInfoRequestColumns;
};

export const orderDetailChangeRequestStatus: Record<EOrderDetailChangeType, string> = {
  [EOrderDetailChangeType.Cancel]: '#ff0000',
  [EOrderDetailChangeType.Change]: '#FFA500',
};

export const orderDetailChangeRequestStatusText: Record<EOrderDetailChangeType, string> = {
  [EOrderDetailChangeType.Cancel]: 'Отмена',
  [EOrderDetailChangeType.Change]: 'Изменение',
};
