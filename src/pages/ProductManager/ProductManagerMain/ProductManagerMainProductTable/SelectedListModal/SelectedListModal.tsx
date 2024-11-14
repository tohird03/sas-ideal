import React from 'react';
import {observer} from 'mobx-react';
import {
  Modal,
} from 'antd';
import {useMediaQuery} from 'usehooks-ts';
import {DataTable} from '@/components/Datatable/datatable';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {productManagerMainProductColumn} from '../../constant';

export const ProductManagerMainProductSelectedModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleModalClose = () => {
    productManagerStore.setIsProductManagerSelectedProductModal(false);
  };

  const handleModalOk = () => {
    productManagerStore.setIsProductManagerSelectedProductModal(false);
  };

  return (
    <>
      <Modal
        open={productManagerStore.isProductManagerMainSelectedProductModal}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        centered
        title="Новый продукт"
        width={1000}
        okText="Создать"
        cancelText="Отмена"
      >
        <DataTable
          columns={productManagerMainProductColumn}
          data={productManagerStore.productManagerMainSelectedProduct!}
          isMobile={isMobile}
          pagination={false}
        />
      </Modal>
    </>
  );
});
