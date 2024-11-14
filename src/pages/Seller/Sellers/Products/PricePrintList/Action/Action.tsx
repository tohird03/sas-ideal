import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {PrinterOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IProductList} from '@/api/product_list/types';
import {sellerProductStore} from '@/stores/seller';

type Props = {
  product: IProductList;
};

export const Action: FC<Props> = observer(({product}) => {

  const handleOpenPrintModal = () => {
    sellerProductStore.setSinglePrintProduct(product);
    sellerProductStore.setIsOpenPrintProductModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleOpenPrintModal} type="primary" icon={<PrinterOutlined />} />
    </div>
  );
});
