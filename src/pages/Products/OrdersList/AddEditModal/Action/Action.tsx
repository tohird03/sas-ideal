import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import { IAddIncomeOrderProducts} from '@/api/income-products/types';
import { IAddOrderProducts } from '@/api/order/types';
import { ordersStore } from '@/stores/products';

type Props = {
  orderAddProduct: IAddOrderProducts;
};

export const Action: FC<Props> = observer(({orderAddProduct}) => {

  const handleEditAddProduct = () => {
    // TODO
  };

  const handleDeleteAddEditProduct = () => {
    const filterProducts = ordersStore.addOrderProducts.filter(product => product?.product_id !== orderAddProduct?.product_id);

    ordersStore.setAddOrderProducts(filterProducts);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {/* <Button onClick={handleEditAddProduct} type="primary" icon={<EditOutlined />} /> */}
      <Popconfirm
        title="Mahsulotni o'chirish"
        description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
        onConfirm={handleDeleteAddEditProduct}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
