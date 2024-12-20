import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import styles from './payments.scss';
import {paymentsColumns} from './constants';
import { paymentsStore } from '@/stores/clients';

const cn = classNames.bind(styles);

export const ClientsPayments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: clientsInfoData, isLoading: loading} = useQuery({
    queryKey: [
      'getPayments',
      paymentsStore.pageNumber,
      paymentsStore.pageSize,
      paymentsStore.search,
    ],
    queryFn: () =>
      paymentsStore.getClientsPayments({
        pageNumber: paymentsStore.pageNumber,
        pageSize: paymentsStore.pageSize,
        search: paymentsStore.search!,
      }),
  });

  const handleAddNewPayment = () => {
    paymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    paymentsStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    paymentsStore.setPageNumber(page);
    paymentsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    paymentsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;lovlar ro&apos;yxati</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
          <Button
            onClick={handleAddNewPayment}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mijoz to&apos;lovi
          </Button>
        </div>
      </div>

      <DataTable
        columns={paymentsColumns}
        data={clientsInfoData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: clientsInfoData?.totalCount,
          current: paymentsStore?.pageNumber,
          pageSize: paymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.totalCount),
        }}
      />

      {paymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
