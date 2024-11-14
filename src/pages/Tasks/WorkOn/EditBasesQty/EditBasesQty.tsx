import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react';
import {InputNumber} from 'antd';
import {IBasesWorkOn} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';

type Props = {
  product: IBasesWorkOn;
} ;

export const EditBasesQty: FC<Props> = observer(({product}) => {

  const onChangeFunc = (value: number) => {

    const updatedRowData = productListStore.selectBasesRowData.map((item) =>
      item.id === product?.id ? {...item, quantity: value} : item);

    productListStore.setSelectBasesRowData(updatedRowData);

  };

  return (
    <>
      <InputNumber
        controls min={1}
        defaultValue={1}
        onChange={(value: number | null) => {
          if (value) {
            onChangeFunc(value);
          }
        }}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g,
          ' ')}
        parser={(value: any) => value.replace(/[A-Z]|[a-z]|[$ ]|\.+/g, '')}
      />
    </>
  );
});

