import React from 'react';
import {Input, InputNumber} from 'antd';
import {ColumnType} from 'antd/es/table';
import {IProcess} from '@/api/process/types';
import {IBasesWorkOn, ICombinationProducts, IConnectedProducts} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';
import {EditBasesQty} from './EditBasesQty/EditBasesQty';
import {EditQuantity} from './EditQuantity/EditQuantity';
import {CombinationTable} from './TabsTable/CombinationTable';
import {CombinationTableAction} from './TabsTable/CombinationTable/CombinationTableActoin';
import {CompositeTable} from './TabsTable/CompositeTable';
import {BaseTableAction} from './TabsTable/CompositeTable/BasTableAction';
import {ProcessTable} from './TabsTable/ProcessTable';
import {ProcessTableAction} from './TabsTable/ProcessTable/ProcessTableAction';
import {ProductTable} from './TabsTable/ProductTable';
import {ProductTableAction} from './TabsTable/ProductTable/ProductTableAction';
import {IWorkOnTabs} from './types';

export const WorkOnTabsItems = [
  {
    key: IWorkOnTabs.Product,
    label: 'Список продуктов',
    children: <ProductTable />,
  },
  {
    key: IWorkOnTabs.CompositeList,
    label: 'Составной список',
    children: <CompositeTable />,
  },
  {
    key: IWorkOnTabs.Process,
    label: 'Список процессов',
    children: <ProcessTable />,
  },
  {
    key: IWorkOnTabs.Combination,
    label: 'Комбинация',
    children: <CombinationTable />,
  },
];

export const workOnProductTable: ColumnType<IConnectedProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (_value, _record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя продукта',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'category',
    dataIndex: 'category',
    title: 'Категория',
    align: 'center',
    render: (value, record) => record?.category?.title,
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'Кол-во',
    align: 'center',
    render: (value, record) => record?.quantity,
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Общая стоимость',
    align: 'center',
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <ProductTableAction data={record} />,
  },
];

export const workOnProductTableModal: ColumnType<IConnectedProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (_value, _record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Имя продукта',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'category',
    dataIndex: 'category',
    title: 'Категория',
    align: 'center',
    render: (value, record) => record?.category?.title,
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'Кол-во',
    align: 'center',
    render: (value, record) => (
      <>{
        record?.id && Boolean(productListStore.selectedRowdata.some((el) => el?.id===record?.id))
          ? <EditQuantity product={record} />
          : <span>{record?.quantity}</span>
      }
      </>
    ),
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Общая стоимость',
    align: 'center',
  },
];

export const workOnCompositeTableColumnModal: ColumnType<IBasesWorkOn>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Базовое имя',
    align: 'center',
    render: (value, record) => <span>{value}</span>,
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'Кол-во',
    align: 'center',
    render: (value, record) => (
      record?.id && Boolean(productListStore.selectBasesRowData.some((el) => el?.id===record?.id))
        ? <EditBasesQty product={record} />
        : <span>0</span>
    ),
  },
  // {
  //   key: 'action',
  //   dataIndex: 'action',
  //   title: 'Действие',
  //   align: 'center',
  //   // render: (value, record) => <WorkOnActionTabs />,
  // },
];
export const workOnCompositeTableColumn: ColumnType<IBasesWorkOn>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Базовое имя',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <BaseTableAction data={record} />,
  },
];

export const workOnProcessTableColumnModal: ColumnType<IProcess>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Название процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'time',
    dataIndex: 'time',
    title: 'Время процесса',
    align: 'center',
    render: (value) => <span>{`${value}`}</span>,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Стоимость процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'unitAmount',
    dataIndex: 'unitAmount',
    title: 'Количество единиц',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'unit',
    dataIndex: 'unit',
    title: 'Unit',
    align: 'center',
    render: (value, record) => record?.unit?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    // render: (value, record) => <WorkOnActionTabs />,
  },
];
export const workOnProcessTableColumn: ColumnType<IProcess>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Название процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'time',
    dataIndex: 'time',
    title: 'Время процесса',
    align: 'center',
    render: (value) => <span>{`${value}`}</span>,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Стоимость процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'unitAmount',
    dataIndex: 'unitAmount',
    title: 'Количество единиц',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'unit',
    dataIndex: 'unit',
    title: 'Unit',
    align: 'center',
    render: (value, record) => record?.unit?.name,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <ProcessTableAction data={record} />,
  },
];

export const workOnCombinationTableColumnModal: ColumnType<ICombinationProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Название процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Цена',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'КОЛ-ВО',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    // render: (value, record) => <WorkOnActionTabs />,
  },
];
export const workOnCombinationTableColumn: ColumnType<ICombinationProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Название процесса',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Цена',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'quantity',
    dataIndex: 'quantity',
    title: 'КОЛ-ВО',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    align: 'center',
    render: (value) => value,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Действие',
    align: 'center',
    render: (value, record) => <CombinationTableAction data={record} />,
  },
];
