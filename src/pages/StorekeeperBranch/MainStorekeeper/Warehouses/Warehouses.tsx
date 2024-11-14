import React from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Typography} from 'antd';
import classNames from 'classnames/bind';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {Canban} from './Canban';
import {AddStorekeeperModal} from './StorekeeperAddModal';
import {ErrorModal} from './StorekeeperAddModal/ErrorModal';
import {WarehouseAddModal} from './WarehouseAddModal';
import styles from './warehouses.scss';

const cn = classNames.bind(styles);

export const MainStorekeeperStock = observer(() => {

  const handleAddNewWarehouse = () => {
    mainStorekeeperStore.setIsOpenAddNewWarehouseModal(true);
  };

  return (
    <>
      <div className={cn('main-st__warehouses')}>
        <Typography.Title level={3}>
          Cклады
        </Typography.Title>
        <div className={cn('main-st__filters')}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNewWarehouse}
          >
            Добавить Cклады
          </Button>
        </div>
      </div>
      <Canban />

      {mainStorekeeperStore.isOpenAddNewWarehouseModal && <WarehouseAddModal />}
      {mainStorekeeperStore.isOpenAddStorekeeperModal && <AddStorekeeperModal />}
      {mainStorekeeperStore.isOpenHaveOldUserError && <ErrorModal />}
    </>
  );
});
