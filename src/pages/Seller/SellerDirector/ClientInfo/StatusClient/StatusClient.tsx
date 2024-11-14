import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {sellerClientStatusApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {clientInfoStore} from '@/stores/seller';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditStatusClient} from './AddEditStatusClientModal';
import {warehouseTypeColumns} from './constants';
import styles from './status-client.scss';

const cn = classNames.bind(styles);

export const StatusClient = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: clienStatusData, isLoading: loading} = useQuery({
    queryKey: [
      'getClientStatus',
      clientInfoStore.clientStatusName,
    ],
    queryFn: () =>
      sellerClientStatusApi.getClintsStatus({
        name: clientInfoStore.clientStatusName!,
      }),
  });

  const handleAddClientStatus = () => {
    clientInfoStore.setIsOpenAddEditClientStatusModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clientInfoStore.setClientStatusName(e.currentTarget.value.trim());
  };

  return (
    <main>
      <div className={cn('status-client__head')}>
        <Typography.Title level={3}>Статус клиента</Typography.Title>
        <div className={cn('status-client__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('status-client__search')}
          />
          <Button
            onClick={handleAddClientStatus}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый
          </Button>
        </div>
      </div>

      <DataTable
        columns={warehouseTypeColumns}
        data={clienStatusData || []}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
      />

      {clientInfoStore.isOpenAddEditClientStatusModal && <AddEditStatusClient />}
    </main>
  );
});
