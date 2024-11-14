import React from 'react';
import {observer} from 'mobx-react';
import {Segmented} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import classNames from 'classnames/bind';
import {IProductStatus} from '@/api/types';
import {applyProductsStore} from '@/stores/provider';
import styles from '../apply-products.scss';
import {ProductTabsOptions} from '../constants';

const cn = classNames.bind(styles);

export const Filter = observer(() => {
  const handleChangeProductTab = (value: SegmentedValue) => {
    applyProductsStore.setProductStatusFilterTab(value as IProductStatus);
  };

  return (
    <div className={cn('apply-products__filter')}>
      <Segmented
        defaultValue={applyProductsStore.productStatusFilterTab}
        onChange={handleChangeProductTab}
        options={ProductTabsOptions}
      />
    </div>
  );
});
