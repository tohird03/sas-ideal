import React from 'react';
import {ColorPicker, Image, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IProductList} from '@/api/product_list/types';
import {priceFormat} from '@/utils/priceFormat';
import {Action} from './Action';

export const newProductsColumns: ColumnType<IProductList>[] = [
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
    title: 'Цена',
    key: 'retail_price',
    dataIndex: 'retail_price',
    align: 'center',
    render: (value, record) => <Tag color="red">{`${priceFormat(record?.oldPriceFactor?.retailPrice)} сум`}</Tag>,
  },
  {
    title: 'Скидка',
    key: 'sale',
    dataIndex: 'sale',
    align: 'center',
    render: (value, record) => <Tag color="orange">{`${record?.oldPriceFactor?.sale}%`}</Tag>,
  },
  {
    title: 'Конечная цена',
    key: 'sale',
    dataIndex: 'sale',
    align: 'center',
    render: (value, record) => {
      const saleAmount = record?.oldPriceFactor?.sale || 0;
      const retailPrice = record?.oldPriceFactor?.retailPrice || 0;
      const finalPrice = `${priceFormat((retailPrice - ((retailPrice * saleAmount) / 100)))}`;

      return (
        <Tag color="green">
          {finalPrice} сум
        </Tag>
      );
    },
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'В корзинку',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
