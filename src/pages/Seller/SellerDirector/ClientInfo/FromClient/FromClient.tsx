import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {sellerClientFromApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {clientInfoStore} from '@/stores/seller';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditFromClientModal} from './AddEditFromClientModal';
import {warehouseTypeColumns} from './constants';
import styles from './from-client.scss';

const cn = classNames.bind(styles);

export const FromClient = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: clientFromData, isLoading: loading} = useQuery({
    queryKey: [
      'getClientFrom',
      clientInfoStore.clientFromName,
    ],
    queryFn: () =>
      sellerClientFromApi.getClintsFrom({
        name: clientInfoStore.clientFromName!,
      }),
  });

  const handleAddFromClient = () => {
    clientInfoStore.setIsOpenAddEditFromClientModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clientInfoStore.setClientFromName(e.currentTarget.value.trim());
  };

  return (
    <main>
      <div className={cn('from-client__head')}>
        <Typography.Title level={3}>От куда клиент</Typography.Title>
        <div className={cn('from-client__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('from-client__search')}
          />
          <Button
            onClick={handleAddFromClient}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый
          </Button>
        </div>
      </div>

      <DataTable
        columns={warehouseTypeColumns}
        data={clientFromData || []}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
      />

      {clientInfoStore.isOpenAddEditFromClientModal && <AddEditFromClientModal />}
    </main>
  );
});
