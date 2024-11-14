import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {FieldTimeOutlined, MoreOutlined, RedoOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IOrder} from '@/api/orders/types';
import {ROUTES} from '@/constants';
import {ordersStore} from '@/stores/centralOperator';

type Props = {
  order: IOrder;
};

export const Action: FC<Props> = observer(({order}) => {
  const navigate = useNavigate();

  const handleReloadSingleOrder = () => {
    navigate(ROUTES.centarlOperatorSingleOrder.replace(':orderId', order?.id));
  };

  const handleChangeDeliveryDate = () => {
    ordersStore.setSingleOrder(order);
    ordersStore.setIsOpenProductChangeDeliveryDateModal(true);
  };

  const handleStatusChange = () => {
    ordersStore.setSingleOrder(order);
    ordersStore.setIsOpenProductStatusChangeModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleStatusChange} type="primary" icon={<RedoOutlined />} />
      <Button onClick={handleChangeDeliveryDate} type="primary" icon={<FieldTimeOutlined />} />
      <Button onClick={handleReloadSingleOrder} type="primary" icon={<MoreOutlined />} />
    </div>
  );
});
