import React from 'react';
import {TabsProps} from 'antd';
import {FromClient} from './FromClient';
import {StatusClient} from './StatusClient';

export const clientInfoTabs: TabsProps['items'] = [
  {
    key: '1',
    label: 'От куда клиент',
    children: <FromClient />,
  },
  {
    key: '2',
    label: 'Статус клиента',
    children: <StatusClient />,
  },
];
