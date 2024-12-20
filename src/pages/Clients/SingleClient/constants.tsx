import React from 'react';
import { ISingleClientTabs } from '@/stores/clients';
import { ClientsPayments } from '../Payments';
import { Payments } from './Payment';
import { Orders } from '@/pages/Products';
import { Deed } from './Deed';

export const singleClientTabOptions = [
  {
    value: ISingleClientTabs.ORDER,
    label: 'Order',
  },
  {
    value: ISingleClientTabs.PAYMENT,
    label: 'Payment',
  },
  {
    value: ISingleClientTabs.DEED,
    label: 'Deed',
  },
];

export const SegmentComponents: Record<ISingleClientTabs, any> = {
  [ISingleClientTabs.ORDER]: <Orders />,
  [ISingleClientTabs.PAYMENT]: <Payments />,
  [ISingleClientTabs.DEED]: <Deed />,
};
