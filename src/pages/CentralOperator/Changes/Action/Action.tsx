import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {AppstoreAddOutlined, DeleteOutlined, InteractionOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {EOrderDetailChangeType, IOrderDetailChange} from '@/api/orders/types';
import {IProductList} from '@/api/product_list/types';
import {changesStore} from '@/stores/centralOperator';

type Props = {
  orderDetailChange: IOrderDetailChange;
};

export const Action: FC<Props> = observer(({orderDetailChange}) => {

  const handleOpenChangeProductInfoRequestModal = () => {
    changesStore.setSingleOrderDetailsChange(orderDetailChange);
    changesStore.setIsOpenChangeProductInfoRequestModal(true);
  };

  const handleAddProductRequestModal = () => {
    changesStore.setSingleOrderDetailsChange(orderDetailChange);
    changesStore.setIsOpenAddProductRequestModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {orderDetailChange?.type === EOrderDetailChangeType.Change &&
        <Button
          onClick={handleOpenChangeProductInfoRequestModal}
          type="primary"
          style={{background: 'orange'}}
          icon={<InteractionOutlined />}
        />
      }

      {orderDetailChange?.type === EOrderDetailChangeType.Cancel &&
        <Button
          onClick={handleAddProductRequestModal}
          style={{background: 'red'}}
          type="primary"
          icon={<DeleteOutlined />}
        />
      }
    </div>
  );
});
