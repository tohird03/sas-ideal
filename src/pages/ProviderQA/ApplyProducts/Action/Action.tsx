import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {RedoOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IWarehouseOrders} from '@/api/wmsOrders/types';
import {applyProductsQaStore} from '@/stores/providerQA';

type Props = {
  product: IWarehouseOrders;
};

export const Action: FC<Props> = observer(({product}) => {
  const handleStatusChange = () => {
    applyProductsQaStore.setSingleProduct(product);
    applyProductsQaStore.setIsOpenProductStatusChangeModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleStatusChange} type="primary" icon={<RedoOutlined />} />
    </div>
  );
});
