import React, { useEffect } from 'react';
import {observer} from 'mobx-react';
import {Segmented} from 'antd';
import { ISingleClientTabs, singleClientStore } from '@/stores/clients/single-client';
import { SegmentedValue } from 'antd/es/segmented';
import { SegmentComponents, singleClientTabOptions } from './constants';
import { useParams } from 'react-router-dom';

export const SingleClient = observer(() => {
  const {clientId} = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleClientStore.setActiveTabs(value as ISingleClientTabs);
  };

  useEffect(() => {
    if (clientId) {
      singleClientStore.getSingleClient(clientId);
    }
  }, [clientId]);

  return (
    <main>
      <Segmented
        defaultValue={ISingleClientTabs.ORDER}
        onChange={handleChangeProductTab}
        options={singleClientTabOptions}
      />

      {SegmentComponents[singleClientStore?.activeTabs]}
    </main>
  );
});
