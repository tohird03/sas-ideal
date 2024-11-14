import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Typography} from 'antd';
import classNames from 'classnames';
import {paymentApi} from '@/api/payment';
import {DataTable} from '@/components/Datatable/datatable';
import {cashierRequestStore} from '@/stores/cashier';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {requestsColumns} from './constants';
import {AddEditPaymentTypeModal} from './RequestPaymentCreateModal';
import styles from './requests.scss';

const cn = classNames.bind(styles);

export const Requests = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: paymentData, isLoading: loading} = useQuery({
    queryKey: [
      'getPaymentType',
      cashierRequestStore.pageNumber,
      cashierRequestStore.pageSize,
    ],
    queryFn: () =>
      paymentApi.getPayments({
        pageNumber: cashierRequestStore.pageNumber,
        pageSize: cashierRequestStore.pageSize,
      }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    cashierRequestStore.setPageNumber(page);
    cashierRequestStore.setPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('requests__head')}>
        <Typography.Title level={3}>Заявки</Typography.Title>
      </div>

      <DataTable
        columns={requestsColumns}
        data={paymentData?.paymentList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: paymentData?.count,
          current: cashierRequestStore?.pageNumber,
          pageSize: cashierRequestStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(paymentData?.count),
        }}
      />

      {cashierRequestStore.isOpenCreatePaymentModal && <AddEditPaymentTypeModal />}
    </main>
  );
});
