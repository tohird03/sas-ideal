import '../myOrder.scss';

import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {MoreOutlined, RetweetOutlined} from '@ant-design/icons';
import {Button, Dropdown, MenuProps} from 'antd';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';

type IProductActionType = {
  productAction: IMainStorekeeperProductList;
};

export const Action = observer(({productAction}: IProductActionType) => {

  const handleOpenChangeStatusModal = () => {
    mainStorekeeperStore.setSingleProduct(productAction);
    mainStorekeeperStore.setIsOpenChangeStatusModal(true);
  };

  return (
    <div className="main-st__action">
      <Button
        type="primary"
        icon={<RetweetOutlined />}
        onClick={handleOpenChangeStatusModal}
      />
    </div>
  );
});


export const WarehouseProductDetailsAction: FC<IProductActionType> = observer(
  ({productAction}) => {

    const handleOpenOrderProductModal = () => {
      mainStorekeeperStore.setIsOpenIsOpenOrderProductModal(true);
      mainStorekeeperStore.setWarehouseOrderProduct(productAction);
    };

    const items: MenuProps['items'] = [
      {
        label: 'Заказать',
        key: '0',
        onClick: handleOpenOrderProductModal,
      },
    ];

    return (
      <>
        <Dropdown menu={{items}} trigger={['click']}>

          <Button shape="circle" type="default" icon={<MoreOutlined />} />
        </Dropdown>
      </>
    );
  }
);

