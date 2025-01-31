import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { SegmentComponents, singleSupplierTabOptions } from './constants';
import { useParams } from 'react-router-dom';
import styles from './single-supplier.scss';
import classNames from 'classnames';
import { ISingleSupplierTabs, singleSupplierStore } from '@/stores/supplier';

const cn = classNames.bind(styles);

export const SingleSupplier = observer(() => {
  const { supplierId } = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleSupplierStore.setActiveTabs(value as ISingleSupplierTabs);
  };

  useEffect(() => {
    if (supplierId) {
      singleSupplierStore.getSingleClient(supplierId);
    }
  }, [supplierId]);

  useEffect(() => () => {
    singleSupplierStore.reset();
  }, []);

  return (
    <main>
      <Segmented
        defaultValue={ISingleSupplierTabs.ORDER}
        onChange={handleChangeProductTab}
        options={singleSupplierTabOptions}
        className={cn('single-supplier__segment')}
      />

      {SegmentComponents[singleSupplierStore?.activeTabs]}
    </main>
  );
});
