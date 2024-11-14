import React from 'react';
import {observer} from 'mobx-react';
import {FilterFilled} from '@ant-design/icons';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {sellerProductStore} from '@/stores/seller';
import styles from '../price-print.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    sellerProductStore.setPrintProductName(event.currentTarget.value.trim());
  };

  const handleOpenPriceProductFilter = () => {
    sellerProductStore.setIsOpenPrintProductFilterModal(true);
  };

  return (
    <div className={cn('price-print__filter-wrapper')}>
      <Typography.Title level={3}>
        Ценник
      </Typography.Title>
      <div className={cn('price-print__filter-wrapper')}>
        <Input
          onChange={handleNameSearch}
          className={cn('price-print__search')}
          placeholder="Поиск по названию продукта"
        />

        <Button
          onClick={handleOpenPriceProductFilter}
          icon={<FilterFilled style={{opacity: '0.5'}} />}
        >
          Фильтр
        </Button>
      </div>
    </div>
  );
});
