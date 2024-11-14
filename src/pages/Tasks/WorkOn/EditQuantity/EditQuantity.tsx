import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react';
import {InputNumber} from 'antd';
import {IConnectedProducts} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';

type Props = {
  product: IConnectedProducts;
} ;

export const EditQuantity: FC<Props> = observer(({product}) => {


  const selectProduct = useMemo(() => productListStore.selectedRowdata.find((el) => el?.id === product?.id),
    [productListStore.selectedRowdata]);

  const onChangeFunc = (value: number) => {

    const updatedRowData = productListStore.selectedRowdata.map((item) =>
      item.id === product?.id ? {...item, quantity: value} : item);

    productListStore.setSelectedRowData(updatedRowData);

  };

  return (
    <>
      <InputNumber
        controls min={1}
        defaultValue={selectProduct?.quantity}
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

