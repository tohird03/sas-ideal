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
import { supplierPaymentsStore } from '@/stores/supplier';

const cn = classNames.bind(styles);

export const SupplierPayments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: clientsInfoData, isLoading: loading} = useQuery({
    queryKey: [
      'getPayments',
      supplierPaymentsStore.pageNumber,
      supplierPaymentsStore.pageSize,
      supplierPaymentsStore.search,
    ],
    queryFn: () =>
      supplierPaymentsStore.getSupplierPayments({
        pageNumber: supplierPaymentsStore.pageNumber,
        pageSize: supplierPaymentsStore.pageSize,
        search: supplierPaymentsStore.search!,
      }),
  });

  const handleAddNewPayment = () => {
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierPaymentsStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierPaymentsStore.setPageNumber(page);
    supplierPaymentsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    supplierPaymentsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;langan qarzlar ro&apos;yxati</Typography.Title>
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
            Yangi to&apos;lov
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
          current: supplierPaymentsStore?.pageNumber,
          pageSize: supplierPaymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.totalCount),
        }}
      />

      {supplierPaymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
