import React from 'react';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {Button, Dropdown, MenuProps} from 'antd';
import {StorekeeperProduct} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';

type Props = {
  data: StorekeeperProduct;
};

export const StorekeeperMainActions = observer(({data}: Props) => {

  const handleOpenShipProductsModal = () => {
    handleAddProductInfoStore();
    storekeeperStore.setIsOpenStorekeeperShipProductModal(true);
  };

  const handleOpenEditStatusModal = () => {
    handleAddProductInfoStore();
    storekeeperStore.setIsOpenStorekeeperEditStatusMainModal(true);
  };

  const handleAddProductInfoStore = () => {
    storekeeperStore.setOneProduct(data);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label:
        <Button
          onClick={handleOpenEditStatusModal}
          block
        >
        Статус
        </Button>,
    },
    {
      key: '2',
      label:
        <Button
          onClick={handleOpenShipProductsModal}
          block
        >Отгрузить
        </Button>,
    },
  ];


  return (
    <>
      <div>
        <Dropdown
          menu={{items}} placement="bottomRight" arrow
          trigger={['click']}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </>
  );
});
