import React from 'react';
import { Deed } from './Deed';
import { Payments } from './Payment';
import { IncomeProducts } from '@/pages/Products';
import { ISingleSupplierTabs } from '@/stores/supplier';

export const singleSupplierTabOptions = [
  {
    value: ISingleSupplierTabs.ORDER,
    label: 'Yetkazib beruvchining kirimlari',
  },
  {
    value: ISingleSupplierTabs.PAYMENT,
    label: 'Yetkazib beruvchiga to\'lovlar',
  },
  {
    value: ISingleSupplierTabs.DEED,
    label: 'Solishtirish dalolatnomalari',
  },
];

export const SegmentComponents: Record<ISingleSupplierTabs, any> = {
  [ISingleSupplierTabs.ORDER]: <IncomeProducts />,
  [ISingleSupplierTabs.PAYMENT]: <Payments />,
  [ISingleSupplierTabs.DEED]: <Deed />,
};
