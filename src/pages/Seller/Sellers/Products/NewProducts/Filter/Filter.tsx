import React from 'react';
import {observer} from 'mobx-react';
import {FilterFilled} from '@ant-design/icons';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {sellerProductStore} from '@/stores/seller';
import styles from '../new-product.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sellerProductStore.setNewProductName(event.currentTarget.value.trim());
  };

  const handleOpenNewProductFilterModal = () => {
    sellerProductStore.setIsOpenNewProductFilterModal(true);
  };

  return (
    <div className={cn('new-product__filter-wrapper')}>
      <Typography.Title level={3}>
        Новый заказ
      </Typography.Title>
      <div className={cn('new-product__filter-wrapper')}>
        <Input
          onChange={handleNameSearch}
          className={cn('new-product__search')}
          placeholder="Поиск по названию продукта"
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
