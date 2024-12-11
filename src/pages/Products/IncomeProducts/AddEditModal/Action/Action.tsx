import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import { IAddIncomeOrderProducts} from '@/api/income-products/types';
import { incomeProductsStore } from '@/stores/products';

type Props = {
  incomeProduc: IAddIncomeOrderProducts;
};

export const Action: FC<Props> = observer(({incomeProduc}) => {
  const handleEditIncomeProduct = () => {
    // TODO
  };

  const handleDeleteAddEditProduct = () => {
    const filterProducts = incomeProductsStore.addIncomeProducts.filter(product => product?.product_id !== incomeProduc?.product_id);

    incomeProductsStore.setAddIncomeProducts(filterProducts);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {/* <Button onClick={handleEditIncomeProduct} type="primary" icon={<EditOutlined />} /> */}
      <Popconfirm
        title="Yetkazib beruvchini o'chirish"
        description="Rostdan ham bu yetkazib beruvchini o'chirishni xohlaysizmi?"
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
