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
import { singleClientStore } from '@/stores/clients';

const cn = classNames.bind(styles);

export const Payments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: clientsInfoData, isLoading: loading} = useQuery({
    queryKey: [
      'getPayments',
      singleClientStore.paymentPage,
      singleClientStore.paymentPageSize,
      singleClientStore.paymentSearch,
    ],
    queryFn: () =>
      singleClientStore.getSingleClientsPayments({
        pageNumber: singleClientStore.paymentPage,
        pageSize: singleClientStore.paymentPageSize,
        search: singleClientStore.paymentSearch!,
      }),
  });

  const handleAddNewPayment = () => {
    singleClientStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    singleClientStore.setPaymentSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    singleClientStore.setPaymentPage(page);
    singleClientStore.setPaymentPageSize(pageSize!);
  };

  useEffect(() => () => {
    singleClientStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;lovlar</Typography.Title>
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
          current: singleClientStore?.paymentPage,
          pageSize: singleClientStore?.paymentPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.totalCount),
        }}
      />

      {singleClientStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
