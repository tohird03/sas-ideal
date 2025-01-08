import React, { forwardRef } from 'react';
import { IOrder } from '@/api/order/types';
import styles from './pdf.scss';
import classNames from 'classnames';
import { getFullDateFormat } from '@/utils/getDateFormat';
import QrImg from '@/assets/img/qr.png';

const cn = classNames.bind(styles);

type Props = {
  order: IOrder;
};

export const Pdf = forwardRef<HTMLDivElement, Props>(({ order }, ref) => (
  <div ref={ref} className={cn('pdf')} style={{ width: '60px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Sotuv vaqti:</p>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>{getFullDateFormat(order?.sellingDate)}</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Mijoz:</p>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, display: 'inline-block', fontWeight: 'bold' }}>{order?.client?.name}</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Mijoz telefon raqami:</p>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>{order?.client?.phone}</p>
    </div>

    <div>
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block', position: 'relative', top: '-10px' }}>
        ***************************************************
      </p>
      {
        order?.products?.map((product, index) => (
          <div key={product?.id} style={{ display: 'flex', justifyContent: 'space-between', width: '80px', position: 'relative', top: '-12px' }}>
            <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>
              {`${index + 1}) ${product?.product?.name}`}
            </p>
            <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>
              {`${product?.count}x${product?.price}$ ****** ${product?.count * product?.price}$`}
            </p>
          </div>
        ))
      }
      <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block', position: 'relative', top: '-20px' }}>
        ***************************************************
      </p>
    </div>

    <div style={{ position: 'relative', top: '-25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Jami narxi:</p>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>{order?.sum}$</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Qarzga:</p>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>{order?.debt}$</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>Jami to&lsquo;lov:</p>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>{order?.payment?.totalPay}$</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80px' }}>
        <p style={{ fontSize: '4px', margin: 0, padding: 0, fontWeight: 'bold', display: 'inline-block' }}>t.me/Sohibjon_ideal</p>
        <img src={QrImg} width={20} alt="t.me/Sohibjon_ideal" />
      </div>
    </div>
  </div>
));
