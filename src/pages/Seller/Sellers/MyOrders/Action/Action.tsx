import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IOrder} from '@/api/orders/types';
import {ROUTES} from '@/constants';

type Props = {
  order: IOrder;
};

export const Action: FC<Props> = observer(({order}) => {
  const navigate = useNavigate();

  const handleReloadSingleOrder = () => {
    navigate(`${ROUTES.sellerMyOrders}/${order?.id}`);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleReloadSingleOrder} type="primary" icon={<MoreOutlined />} />
    </div>
  );
});
