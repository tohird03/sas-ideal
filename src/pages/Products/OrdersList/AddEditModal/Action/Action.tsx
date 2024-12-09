import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import { IAddIncomeOrderProducts} from '@/api/income-products/types';
import { IAddOrderProducts } from '@/api/order/types';

type Props = {
  incomeProduct: IAddOrderProducts;
};

export const Action: FC<Props> = observer(({incomeProduct}) => {
  const handleEditIncomeProduct = () => {
    // TODO
  };

  const handleDelete = () => {
    // TODO
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditIncomeProduct} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Yetkazib beruvchini o'chirish"
        description="Rostdan ham bu yetkazib beruvchini o'chirishni xohlaysizmi?"
        onConfirm={handleDelete}
        okText="Ha"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Yo'q"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
