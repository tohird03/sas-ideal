import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IStorekeeperMainType} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';

type Props = {
  data: IStorekeeperMainType;
};
export const StorekeeperAddProductBasketActions: FC<Props> =
    observer(({data}) => {

      const handleOpenAddProductbasketModal = () => {
        storekeeperStore.setAddProductBasket(data);
        storekeeperStore.
          setIsOpenStorekeeperAddProductBasketModal(true);
      };

      return (
        <>
          <Button
            onClick={handleOpenAddProductbasketModal}
            icon={<ShoppingCartOutlined />}
          />
        </>
      );
    });

