import React from 'react';
import {observer} from 'mobx-react';
import {Segmented} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import classNames from 'classnames/bind';
import {IGetWmsProvidersStorekeeperProductsTypes} from '@/api/wmsProducts/types';
import {relatedProductsStore} from '@/stores/provider/related-products/related-products';
import {ProductTabsOptions} from '../constants';
import styles from '../related-products.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {
  const handleChangeProductTab = (value: SegmentedValue) => {
    relatedProductsStore.setProductActiveTab(value as IGetWmsProvidersStorekeeperProductsTypes);
  };

  // const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   // TODO
  // };

  return (
    <div className={cn('related-products__filter')}>
      <Segmented
        defaultValue="center"
        onChange={handleChangeProductTab}
        options={ProductTabsOptions}
        value={relatedProductsStore.productActiveTab}
      />
      {/* <div>
        <Input
          onChange={handleNameSearch}
          placeholder="Поиск по названия"
        />
      </div> */}
    </div>
  );
});
