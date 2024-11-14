import React from 'react';
import {observer} from 'mobx-react';
import {FilterFilled} from '@ant-design/icons';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {sellerProductStore} from '@/stores/seller';
import styles from '../product-warehouse.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sellerProductStore.setWarehouseProductName(event.currentTarget.value.trim());
  };

  const handleOpenNewProductFilterModal = () => {
    sellerProductStore.setIsOpenWarehouseProductFilterModal(true);
  };

  return (
    <div className={cn('warehouse-product__filter-wrapper')}>
      <Typography.Title level={3}>
        Товары на складе
      </Typography.Title>
      <div className={cn('warehouse-product__filter-wrapper')}>
        <Input
          onChange={handleNameSearch}
          className={cn('warehouse-product__search')}
          placeholder="Поиск по ID товара"
          allowClear
        />

        <Button
          onClick={handleOpenNewProductFilterModal}
          icon={<FilterFilled style={{opacity: '0.5'}} />}
        >
          Фильтр
        </Button>
      </div>
    </div>
  );
});
