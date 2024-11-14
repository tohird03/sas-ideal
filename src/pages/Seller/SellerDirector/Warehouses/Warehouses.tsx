import React from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Typography} from 'antd';
import classNames from 'classnames/bind';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {sellerShowroomsStore} from '@/stores/seller';
import {Canban} from './Canban';
import {AddShowroomModal} from './ShowroomAddEditModal';
import {AddStorekeeperModal} from './StorekeeperAddModal';
import {ErrorModal} from './StorekeeperAddModal/ErrorModal';
import styles from './warehouses.scss';

const cn = classNames.bind(styles);

export const Showroom = observer(() => {

  const handleAddNewWarehouse = () => {
    sellerShowroomsStore.setIsOpenAddEditShowroomModal(true);
  };

  return (
    <>
      <div className={cn('main-st__warehouses')}>
        <Typography.Title level={3}>
          Шоурумы
        </Typography.Title>
        <div className={cn('main-st__filters')}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNewWarehouse}
          >
            Добавить выставочные лист
          </Button>
        </div>
      </div>
      <Canban />

      {sellerShowroomsStore.isOpenAddEditShowroomModal && <AddShowroomModal />}
      {sellerShowroomsStore.isOpenAddEditSellerModal && <AddStorekeeperModal />}
      {mainStorekeeperStore.isOpenHaveOldUserError && <ErrorModal />}
    </>
  );
});
