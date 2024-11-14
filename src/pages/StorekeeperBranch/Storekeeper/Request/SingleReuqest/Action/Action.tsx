import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IRequestToWarehouseProducts} from '@/api/storekeeper/types';
import {storekeeperRequestStore} from '@/stores/storekeeper';

type Props = {
  requestProducts: IRequestToWarehouseProducts;
};

export const Action: FC<Props> = observer(({requestProducts}) => {

  const handleOpenReuqestAddProduct = () => {
    storekeeperRequestStore.setSingleRequestToWarehouseProducts(requestProducts);
    storekeeperRequestStore.setIsOpenAddProductModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleOpenReuqestAddProduct} type="primary" icon={<PlusOutlined />} />
    </div>
  );
});
