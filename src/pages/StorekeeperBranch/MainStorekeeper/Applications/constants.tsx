import React from 'react';
import {ColumnType} from 'antd/es/table';
import {
  IAddResponseApplication,
  IMainStorekeeperProductList,
  IRequest,
} from '@/api/mainStorekeeper/types';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {ApplicationProductActions} from './ApplicationsActions/ApplicationProductActions';
import {ApplicationsActions} from './ApplicationsActions/ApplicationsActions';
import {
  ApplicantComp,
  ProductComp,
  RecipientComp,
  ReqProductTissueComp,
} from './ColumnComponents';

export const applicationsColumns: ColumnType<IRequest>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    title: 'Оформлено в',
    dataIndex: 'createdAt',
    align: 'center',
    key: 'createdAt',
    render: (value) => <>{getFullDateFormat(value)}</>,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
  },
  {
    title: 'Заявитель',
    dataIndex: 'applicant',
    key: 'applicant',
    render: (value, record) => (
      <ApplicantComp
        name={record?.requester?.firstName}
        lastName={record?.requester?.lastName}
        phone={record?.requester?.phone}
        image={''}
      />
    ),
  },
  {
    title: 'Получатель',
    dataIndex: 'recipient',
    key: 'recipient',
    render: (value, record) => (
      <RecipientComp name={record?.clientName} phone={record?.clientPhone} />
    ),
  },
  {
    title: 'От куда',
    dataIndex: ['from', 'name'],
    key: 'from',
    align: 'center',
  },
  {
    title: 'Куда',
    dataIndex: 'to',
    key: 'to',
    align: 'center',
  },
  {
    title: 'Когда',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    align: 'center',
    render: (value) => <>{getFullDateFormat(value)}</>,
  },
  {
    title: 'Действия',
    dataIndex: 'actions',
    key: 'actions',
    render: (value, record) => (
      <ApplicationsActions id={record?.id} statusName={record?.status} />
    ),
  },
];

export const applicationsFilterByStatusOptions = [
  {
    label: 'active',
    value: 'active',
  },

  {
    label: 'process',
    value: 'process',
  },

  {
    label: 'done',
    value: 'done',
  },
];

export const localApplicationColumn: ColumnType<IAddResponseApplication>[] = [
  {
    title: 'Получатель',
    dataIndex: 'recipient',
    key: 'recipient',
    render: (value, record) => (
      <RecipientComp name={record?.clientName} phone={record?.clientPhone} />
    ),
  },
  {
    title: 'От куда',
    dataIndex: ['from', 'name'],
    key: 'from',
    render: (value, record) => record?.from?.name,
  },
  {
    title: 'Куда',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'Когда',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    render: (value) => <>{getFullDateFormat(value)}</>,
  },
];

export const applicationProductColumn: ColumnType<IMainStorekeeperProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'partId',
    dataIndex: 'partId',
    title: 'ИД товара',
    align: 'center',
  },
  {
    key: 'model',
    dataIndex: ['model', 'name'],
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <ProductComp
        images={record?.images?.length ? record?.images[0] : undefined}
        modelName={record?.model?.name}
        categoryName={record?.category?.title}
        directionName={record?.direction?.title}
      />
    ),
  },

  {
    key: 'tissue',
    dataIndex: ['tissue', 'name'],
    title: 'Ткань',
    align: 'center',
    render: (value, record) => (
      <ReqProductTissueComp
        tissueColor={record?.tissue?.hexColor}
        tissueColorName={record?.tissue?.name}
        tissueName={record?.tissue?.tissue?.name}
      />
    ),
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'Количество',
    align: 'center',
    render: (value) => `${value} шт`,
  },
];

export const requestProductsColumn: ColumnType<IMainStorekeeperProductList>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '№',
    align: 'center',
    width: 80,
    render: (value, record, index) => index + 1,
  },

  {
    key: 'model',
    dataIndex: ['model', 'name'],
    title: 'Продукт',
    align: 'center',
    render: (value, record) => (
      <ProductComp
        images={record?.images?.length ? record?.images[0] : undefined}
        modelName={record?.model?.name}
        categoryName={record?.category?.title}
        partId={record?.partId}
        directionName={record?.direction?.title}
      />
    ),
  },

  {
    key: 'tissue',
    dataIndex: ['tissue', 'name'],
    title: 'Ткань',
    align: 'center',
    render: (value, record) => (
      <ReqProductTissueComp
        tissueColor={record?.tissue?.hexColor}
        tissueColorName={record?.tissue?.name}
        tissueName={record?.tissue?.tissue?.name}
      />
    ),
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Количество',
    align: 'center',
    width: 160,
    render: (value) => `${value} шт`,
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: 'Действия',
    align: 'center',
    width: 160,
    render: (value, record) => <ApplicationProductActions data={record} />,
  },
];
