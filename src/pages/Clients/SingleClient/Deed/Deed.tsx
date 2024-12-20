import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {useMediaQuery} from '@/utils/mediaQuery';
import {deedColumns} from './constants';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import styles from './deed.scss';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {clientId} = useParams();

  const {data: clientDeedData, isLoading: loading} = useQuery({
    queryKey: ['getDeed', clientId],
    queryFn: () =>
      singleClientStore.getClientDeed({
        id: clientId!,
      }),
  });

  useEffect(() => () => {
    singleClientStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('deed__filter')}>
          {/* FILTER */}
        </div>
      </div>

      <DataTable
        columns={deedColumns}
        data={clientDeedData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
      />
    </main>
  );
});
