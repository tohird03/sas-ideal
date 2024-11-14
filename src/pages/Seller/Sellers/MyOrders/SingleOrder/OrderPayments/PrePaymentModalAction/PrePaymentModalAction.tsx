import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {ISellerProductSalePayments} from '@/api/seller/sellerSaleAndOrder/types';
import {sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';

type Props = {
  payment: ISellerProductSalePayments;
};

export const PrePaymentAction: FC<Props> = observer(({payment}) => {

  const handleDeletePayment = () => {
    const deleteFilterPayment = sellerMyOrdersStore.mySingleOrderPrePayments?.filter(oldPayment => oldPayment?.id !== payment?.id);

    sellerMyOrdersStore?.setMySingleOrderPrePayments(deleteFilterPayment);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onClick={handleDeletePayment}
        type="primary"
        icon={<DeleteOutlined />}
        danger
      />
    </div>
  );
});
