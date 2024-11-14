import React from 'react';
import {ColorPicker, Image, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {imgStages} from '@/api/endpoints';
import {IProductList} from '@/api/product_list/types';
import {IPromotionProducts} from '@/api/promotion/types';

export const singlePromotionProductColumns: ColumnType<IPromotionProducts>[] = [
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
        {record?.product?.images[0]
          && <Image src={`${imgStages?.apiUrl}${record?.product?.images[0]}`} width={80} height={40} />
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
        {record?.product?.tissueColor
          ? (
            <>
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
            </>
          )
          : '-'
        }
      </div>
    ),
  },
  {
    key: 'discount',
    dataIndex: 'discount',
    title: 'Скидка',
    align: 'center',
    render: (value, record) => `${record?.discount} %`,
  },
];
export const addProductColumns: ColumnType<IProductList>[] = [
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
];
