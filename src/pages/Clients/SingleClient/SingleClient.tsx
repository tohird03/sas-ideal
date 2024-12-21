import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Segmented } from 'antd';
import { ISingleClientTabs, singleClientStore } from '@/stores/clients/single-client';
import { SegmentedValue } from 'antd/es/segmented';
import { SegmentComponents, singleClientTabOptions } from './constants';
import { useParams } from 'react-router-dom';
import styles from './single-client.scss';
import classNames from 'classnames';

const cn = classNames.bind(styles);

export const SingleClient = observer(() => {
  const { clientId } = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleClientStore.setActiveTabs(value as ISingleClientTabs);
  };

  useEffect(() => {
    if (clientId) {
      singleClientStore.getSingleClient(clientId);
    }
  }, [clientId]);

  useEffect(() => () => {
    singleClientStore.reset();
  }, []);

  return (
    <main>
      <Segmented
        defaultValue={ISingleClientTabs.ORDER}
        onChange={handleChangeProductTab}
        options={singleClientTabOptions}
        className={cn('single-client__segment')}
      />

      {SegmentComponents[singleClientStore?.activeTabs]}
    </main>
  );
});
