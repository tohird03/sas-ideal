import React, { useEffect } from 'react';
import { Button, Modal, notification } from 'antd';
import { observer } from 'mobx-react';
import { ordersStore } from '@/stores/products';
import { DataTable } from '@/components/Datatable/datatable';
import { ordersInfoColumns, ordersInfoPaymentColumns, ordersInfoProductsColumns } from '../constants';
import styles from '../orders.scss';
import classNames from 'classnames';
import { useMediaQuery } from '@/utils/mediaQuery';

const cn = classNames.bind(styles);

export const OrderShowInfoModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setIsOpenShowOrderModal(false);
  };

  useEffect(() => {
    if (!ordersStore?.singleOrder) {
      notification.error({
        message: 'Bu sotuv topilmadi!',
        placement: 'topRight',
      });
      handleModalClose();
    }
  }, [ordersStore?.singleOrder]);

  return (
    <Modal
      open={ordersStore.isOpenShowOrderModal}
      title={'Sotuv'}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      width={1200}
      footer={
        <Button onClick={handleModalClose}>
          Yopish
        </Button>
      }
    >
      <div className={cn('order__show-header')}>
        <DataTable
          columns={ordersInfoColumns}
          data={[ordersStore?.singleOrder]}
          isMobile
          pagination={false}
        />
        <DataTable
          columns={ordersInfoPaymentColumns}
          data={[ordersStore?.singleOrder]}
          isMobile
          pagination={false}
        />
      </div>
      <div>
        <DataTable
          columns={ordersInfoProductsColumns}
          data={ordersStore?.singleOrder?.products || []}
          isMobile={isMobile}
          pagination={false}
        />
      </div>
    </Modal>
  );
});
