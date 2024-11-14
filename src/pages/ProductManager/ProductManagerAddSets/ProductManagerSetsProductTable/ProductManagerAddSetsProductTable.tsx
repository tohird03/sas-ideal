import './productmanageraddsetsproducttable.scss';

import React from 'react';
import {observer} from 'mobx-react';
import {Button, Form, Typography} from 'antd';
import {IGetProductManagerSetsType} from '@/api/productmanager/tyes';
import {DataTable} from '@/components/Datatable/datatable';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {productManagerSetsColumn} from './constant';

const productManagerSetsData: IGetProductManagerSetsType[] = [
  {
    id: '1',
    category: 'Названия категория',
    model: 'Названия модел',
    corner: 'Нет',
    fabric_color: '#129613',
    qty: '564',
    result: 564,
  },
  {
    id: '1',
    category: 'Названия категория',
    model: 'Названия модел',
    corner: 'Нет',
    fabric_color: '#193213',
    qty: '564',
    result: 564,
  },
  {
    id: '1',
    category: 'Названия категория',
    model: 'Названия модел',
    corner: 'Нет',
    fabric_color: '#123293',
    qty: '564',
    result: 564,
  },
  {
    id: '1',
    category: 'Названия категория',
    model: 'Названия модел',
    corner: 'Нет',
    fabric_color: '#123913',
    qty: '564',
    result: 564,
  },
];


export const ProductManagerSetsProduct = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [form] = Form.useForm();

  const handlePageChange = () => {
    console.log('Page Changed');
  };

  const handleAddSetsProductModal = () => {
    productManagerStore.setIsProductSetsAddProductModal(true);
  };

  return (
    <>
      <div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Typography.Title level={3}>Продукты</Typography.Title>
          <Button
            style={{position: 'absolute', right: '0'}}
            onClick={handleAddSetsProductModal}
          >
            Добавить продукт
          </Button>
        </div>

        <DataTable
          columns={productManagerSetsColumn}
          data={productManagerSetsData}
          // loading={}
          isMobile={isMobile}
          pagination={{
            total: 10,
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(10),
          }}
        />
      </div>
    </>
  );
});
