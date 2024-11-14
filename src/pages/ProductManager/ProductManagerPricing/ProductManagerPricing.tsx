import './productmanagerpricing.scss';

import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {ArrowDownOutlined, ArrowUpOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Switch, Typography} from 'antd';
import classNames from 'classnames';
import {IGetCategoryManagerPricing} from '@/api/productmanager/tyes';
import {DataTable} from '@/components/Datatable/datatable';
import {categoriesStore} from '@/stores/categories';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {productManagerPricingColumn} from './constants';
import {ProductManagerPricingAddEditModal} from './ProductManagerPricingModal/ProductManagerPricingModal';

const productManagerPricingData: IGetCategoryManagerPricing[] = [
  {
    id: '1',
    name: 'Скидка',
    formula: '= Равно',
    type: (<><span style={{color: 'red'}}><ArrowDownOutlined /></span></>),
    necessarily: (<><Switch defaultChecked /></>),
  },
  {
    id: '2',
    name: 'Скидка',
    formula: '= Равно',
    type: (<><span style={{color: 'green'}}><ArrowUpOutlined /></span></>),
    necessarily: (<><Switch defaultChecked /></>),
  },
];

export const ProductManagerPricing = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleAddPricing = () => {
    productManagerStore.setIsProductManagerPricingSingle(null);
    productManagerStore.setIsProductManagerPricingModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {};

  const handlePageChange = (page: number, pageSize: number | undefined) => {};


  useEffect(() => () => {
    categoriesStore.setSearch('');
  }, []);

  return (
    <main>
      <div className="product-manager__head">
        <Typography.Title level={3}>Ценаобразования</Typography.Title>
        <div className="product-manager__filter">
          <Button
            onClick={handleAddPricing}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый продукт
          </Button>
        </div>
      </div>

      <DataTable
        columns={productManagerPricingColumn}
        data={productManagerPricingData}
        // loading={loading}
        isMobile={isMobile}
        pagination={{
          total: 1,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(1),
        }}
      />
      {productManagerStore.isProductManagerPricingModal && <ProductManagerPricingAddEditModal />}
    </main>
  );
});
