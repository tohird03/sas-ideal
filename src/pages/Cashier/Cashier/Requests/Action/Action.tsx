import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {VerticalAlignBottomOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IPayment} from '@/api/payment/types';
import {cashierRequestStore} from '@/stores/cashier';

type Props = {
  payment: IPayment;
};

export const Action: FC<Props> = observer(({payment}) => {

  const handleEditPaymentType = () => {
    cashierRequestStore.setSingleRequest(payment);
    cashierRequestStore.setIsOpenCreatePaymentModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditPaymentType} type="primary" icon={<VerticalAlignBottomOutlined />} />
    </div>
  );
});
