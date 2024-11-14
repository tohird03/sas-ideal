import React, {useRef} from 'react';
// @ts-ignore
import ReactToPrint from 'react-to-print';
import {observer} from 'mobx-react';
import {PrinterOutlined} from '@ant-design/icons';
import {Button, Modal} from 'antd';
import classNames from 'classnames/bind';
import {sellerProductStore} from '@/stores/seller';
import {priceFormat} from '@/utils/priceFormat';
import styles from '../price-print.scss';

const cn = classNames.bind(styles);

export const PrintModal = observer(() => {
  const qrPrintRef = useRef(null);

  const handleCancel = () => {
    sellerProductStore.setSinglePrintProduct(null);
    sellerProductStore.setIsOpenPrintProductModal(false);
  };

  const saleAmount = sellerProductStore?.singlePrintProduct?.oldPriceFactor?.sale || 0;
  const retailPrice = sellerProductStore?.singlePrintProduct?.oldPriceFactor?.retailPrice || 0;
  const finalPrice = `${priceFormat((retailPrice - ((retailPrice * saleAmount) / 100)))}`;

  return (
    <Modal
      open={sellerProductStore.isOpenPrintProductModal}
      onCancel={handleCancel}
      title="Цена"
      centered
      maskClosable={false}
      footer={
        <ReactToPrint
          content={() => qrPrintRef.current}
          trigger={() => <Button icon={<PrinterOutlined />}>Печать</Button>}
        />
      }
      width={650}
    >
      <div
        style={{
          padding: '0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '20px',
          borderBottom: '1px solid black',
        }}
        ref={qrPrintRef}
      >
        <div className={cn('receipt')}>
          <div className="creditDetails">
            <div className={cn('print__sale')}>
              <div>
                <span style={{fontSize: '20px', fontWeight: 'bold'}}>
                  скидка
                </span>
                <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                  {saleAmount}$
                </p>
              </div>
            </div>
            <div className={cn('print_new-price')}>
              <span style={{fontSize: '25px', fontWeight: 'bold'}}>
                Новая цена
              </span>
              <p style={{fontSize: '40px', fontWeight: 'bold'}}>
                {finalPrice} сум
              </p>
            </div>
            <p style={{fontSize: '16px', marginBottom: '10px', textAlign: 'center'}}>
              <span style={{fontSize: '22.5px'}}>
                {sellerProductStore?.singlePrintProduct?.model?.name} - {sellerProductStore?.singlePrintProduct?.name}
              </span>
            </p>
            <p className={cn('print_old-price')}>
              Старая цена
              <span style={{fontSize: '25px', textDecoration: 'line-through'}}>
                {priceFormat(retailPrice)}сум
              </span>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
});
