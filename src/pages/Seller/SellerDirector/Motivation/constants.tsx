import React from 'react';
import {ColorPicker, Image, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IProductList} from '@/api/product_list/types';
import {priceFormat} from '@/utils/priceFormat';

export const motivationProductsColumns: ColumnType<IProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'product',
    dataIndex: 'product',
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <div style={{display: 'flex', gap: '10px'}}>
        {record?.images[0]
          && <Image src={`${imgStages?.apiUrl}${record?.images[0]}`} width={80} height={40} />
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
        {record?.tissueColor
          ? (
            <>
              <div>
                <Typography.Title
                  style={{margin: 0, textAlign: 'left'}}
                  level={5}
                >
                  {record?.tissueColor?.tissue?.name}
                </Typography.Title>
                <Typography.Text>{record?.tissueColor?.name}</Typography.Text>
              </div>
              <ColorPicker value={record?.tissueColor?.hexColor} disabled />
            </>
          )
          : '-'
        }
      </div>
    ),
  },
  {
    key: 'retailPrice',
    dataIndex: 'retailPrice',
    title: 'Роз. цена',
    align: 'center',
    render: (value, record) => {
      const retailPrice = record?.oldPriceFactor?.retailPrice || 0;
      const costPrice = record?.oldPriceFactor?.costPrice || 0;
      const fmPrice = costPrice + costPrice * ((record?.oldPriceFactor?.factoryPrice || 0) / 100);
      const investorPrice = fmPrice + fmPrice * ((record?.oldPriceFactor?.investorPrice || 0) / 100);
      const marja = retailPrice - investorPrice;

      return (
        <div>
          <p style={{margin: '0', fontWeight: 'bold'}}>
            {priceFormat(retailPrice)} сум
          </p>
          <p style={{margin: '0', fontSize: '12'}}>
            {priceFormat(marja)} сум маржа
          </p>
        </div>
      );
    },
  },
  {
    key: 'retailPrice',
    dataIndex: 'retailPrice',
    title: 'Скидка',
    align: 'center',
    render: (value, record) => {
      const promotionDiscount = record?.promotion[0]?.discount || 0;
      const retailPrice = record?.oldPriceFactor?.retailPrice || 0;
      const salePrice = (retailPrice * promotionDiscount) / 100;
      const costPrice = record?.oldPriceFactor?.costPrice || 0;
      const fmPrice = costPrice + costPrice * ((record?.oldPriceFactor?.factoryPrice || 0) / 100);
      const investorPrice = fmPrice + fmPrice * ((record?.oldPriceFactor?.investorPrice || 0) / 100);
      const marja = retailPrice - investorPrice;
      const pribil = marja - salePrice;

      return (
        <div>
          <p style={{margin: '0', fontWeight: 'bold'}}>
            {promotionDiscount}%
          </p>
          <p style={{margin: '0', fontSize: '12'}}>
            {priceFormat(salePrice)} скидка
          </p>
          <p style={{margin: '0', fontSize: '12'}}>
            {priceFormat(pribil)} прибыль
          </p>
        </div>
      );
    },
  },
  {
    key: 'sellerPercent',
    dataIndex: 'sellerPercent',
    title: '% от продаж',
    align: 'center',
    render: (value, record) => {
      const sellerPercent = record?.oldPriceFactor?.sellerPercent || 0;
      const promotionDiscount = record?.promotion[0]?.discount || 0;
      const retailPrice = record?.oldPriceFactor?.retailPrice || 0;
      const salePrice = (retailPrice * promotionDiscount) / 100;
      const costPrice = record?.oldPriceFactor?.costPrice || 0;
      const fmPrice = costPrice + costPrice * ((record?.oldPriceFactor?.factoryPrice || 0) / 100);
      const investorPrice = fmPrice + fmPrice * ((record?.oldPriceFactor?.investorPrice || 0) / 100);
      const marja = retailPrice - investorPrice;
      const pribil = marja - salePrice;
      const perSalePrice = (sellerPercent * pribil) / 100;
      const prePribil = pribil - perSalePrice;

      return (
        <div>
          <p style={{margin: '0', fontWeight: 'bold'}}>
            {sellerPercent}%
          </p>
          <p style={{margin: '0', fontSize: '12'}}>
            {priceFormat(perSalePrice)} за продаж
          </p>
          <p style={{margin: '0', fontSize: '12'}}>
            {priceFormat(prePribil)} прибыль
          </p>
        </div>
      );
    },
  },
];
