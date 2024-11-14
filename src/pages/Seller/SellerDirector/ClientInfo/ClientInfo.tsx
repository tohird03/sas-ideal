import React from 'react';
import {observer} from 'mobx-react';
import {Tabs} from 'antd';
import {clientInfoTabs} from './constants';

export const ClientInfo = observer(() => (
  <Tabs
    defaultActiveKey="1"
    items={clientInfoTabs}
  />
));
