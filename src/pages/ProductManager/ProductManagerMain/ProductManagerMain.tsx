import './productmanagermain.scss';

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {FilterOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Input, Tabs, Typography} from 'antd';
import {IProductManagerTabStatus} from '@/api/productmanager/tyes';
import {ROUTES} from '@/constants';
import {productListStore} from '@/stores/product_list/product_list';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ProductManagerMainTabs} from './constant';
import {CreateProductMinPriceModal} from './CreateProductMinPriceModal';
import {ProductManagerAddEditModal} from './ProductManagerAddEditModal/ProductManagerAddEditModal';
import {FactorsheetModal} from './ProductManagerMainProductTable/FactorsheetModal/FactorsheetModal';
import {
  ProductManagerMainProductSelectedModal,
} from './ProductManagerMainProductTable/SelectedListModal/SelectedListModal';
import {ProductManagerProductFilterModal} from './ProductManagerProductFilterModal/ProductManagerProductFilterModal';

export const ProductManagerMain = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const tabKey = productManagerStore.productManagerMainTabKey;
  const [selected, setSelected] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (activeKey: string) => {
    productManagerStore.setIsProductManagerMainTabKey(activeKey as IProductManagerTabStatus);
    productManagerStore.setIsProductManagerMainSelectedProduct([]);
  };

  const handleIsOpenSelectedModal = () => {
    productManagerStore.setIsProductManagerSelectedProductModal(true);
  };

  const handleIsOpenFactorsheetModal = () => {
    productManagerStore.setIsProductManagerMainFactorsheetModal(true);
  };

  const handleAdd = () => {
    if (tabKey === IProductManagerTabStatus.Product) {
      productManagerStore.setIsProductManagerModal(true);
    } else {
      navigate(ROUTES.productManagerSets);
    }
  };

  useEffect(() => {
    let isSelected;

    if (tabKey === IProductManagerTabStatus.Product) {
      isSelected = !!productManagerStore.productManagerMainSelectedProduct;
    }

    setSelected(!isSelected);
  }, [
    tabKey,
    productManagerStore.productManagerMainSelectedProduct,
  ]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement
  | HTMLTextAreaElement>) => {
    productListStore.setSearch(e.target.value.trim());
  };

  const handleOpenFilterModal = () => {
    productListStore.setIsOpenPmsProductFilterModal(true);
  };

  useEffect(() => {
    productListStore.setFilterParams(null);
  }, [window.location.pathname]);

  return (
    <>
      <main>
        <div className="product-manager_list__head">
          <Typography.Title level={3}>
            {
              tabKey === IProductManagerTabStatus.Product
                ? 'Менеджер Продукты'
                : 'Менеджер Комплектов'
            }
          </Typography.Title>
          <div className="product-manager_list__filter">
            {
              tabKey === IProductManagerTabStatus.Product
                ? (
                  <>
                    {
                      productManagerStore.productManagerMainSelectedProduct
                        ? (
                          <Button
                            disabled={selected}
                            onClick={handleIsOpenSelectedModal}
                          >
                            Выделели: {productManagerStore.productManagerMainSelectedProduct.length}
                          </Button>
                        )
                        : ''
                    }
                    <Button
                      onClick={handleOpenFilterModal}
                    >
                      Фильтр <FilterOutlined />
                    </Button>

                    <Input
                      onChange={handleSearch}
                      allowClear
                      placeholder="Поиск по имени"
                    />
                    <Button
                      disabled={selected}
                      onClick={handleIsOpenFactorsheetModal}
                    >
                      Ценаобразовния
                    </Button>
                  </>
                )
                : ''
            }

            <Button
              onClick={handleAdd}
              type="primary"
              icon={<PlusOutlined />}
            >
              Новый продукт
            </Button>
          </div>
        </div>

        <Tabs
          centered={isMobile}
          tabPosition={isMobile ? 'bottom' : 'top'}
          onChange={handleTabChange}
          defaultActiveKey={tabKey}
          size="large"
          items={ProductManagerMainTabs}
        />

        {productManagerStore.isProductManagerMainSelectedProductModal && <ProductManagerMainProductSelectedModal />}
        {productManagerStore.isProductManagerMainFactorsheetModal && <FactorsheetModal />}
        {productManagerStore.isProductAddManagerModal && <ProductManagerAddEditModal />}
        {productManagerStore.isOpenCreateProductMinPriceModal && <CreateProductMinPriceModal />}
        {productListStore.isOpenPmsProductFilterModal && <ProductManagerProductFilterModal />}
      </main>
    </>
  );
});
