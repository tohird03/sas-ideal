import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {warehouseListStore} from '@/stores/mainStorekkeper';

type Props = {
  product: IMainStorekeeperProductList;
};

export const Action: FC<Props> = observer(({product}) => {

  const handleOpenProductChangeCountModal = () => {
    warehouseListStore.setSingleProduct(product);
    warehouseListStore.setIsOpenProductChangeMinCountModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleOpenProductChangeCountModal} type="primary" icon={<MoreOutlined />} />
    </div>
  );
});
