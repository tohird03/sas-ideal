import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { IOrderProducts } from '@/api/order/types';
import { ordersApi } from '@/api/order';
import { ordersStore } from '@/stores/products';
import { addNotification } from '@/utils';

type Props = {
  orderAddProduct: IOrderProducts;
};

export const Action: FC<Props> = observer(({ orderAddProduct }) => {

  const handleEditAddProduct = () => {
    // TODO
  };

  const handleDeleteOrderproduct = () => {
    ordersApi.deleteOrderProduct(orderAddProduct?.id)
      .then(() => {
        ordersStore.getSingleOrder(ordersStore.order?.id!);
      })
      .catch(addNotification);

  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Button onClick={handleEditAddProduct} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Mahsulotni o'chirish"
        description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
        onConfirm={handleDeleteOrderproduct}
        okText="Ha"
        okButtonProps={{ style: { background: 'red' } }}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
