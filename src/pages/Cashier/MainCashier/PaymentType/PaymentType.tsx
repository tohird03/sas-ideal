import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {paymentTypeApi} from '@/api/paymentType';
import {DataTable} from '@/components/Datatable/datatable';
import {paymentTypeStore} from '@/stores/cashier';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditPaymentTypeModal} from './AddEditPaymentTypeModal';
import {paymentTypeColumns} from './constants';
import styles from './payment-type.scss';

const cn = classNames.bind(styles);

export const PaymentType = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: paymentTypeData, isLoading: loading} = useQuery({
    queryKey: [
      'getPaymentType',
      paymentTypeStore.pageNumber,
      paymentTypeStore.pageSize,
      paymentTypeStore.name,
    ],
    queryFn: () =>
      paymentTypeApi.getPaymentType({
        pageNumber: paymentTypeStore.pageNumber,
        pageSize: paymentTypeStore.pageSize,
        name: paymentTypeStore.name!,
      }),
  });

  const handleAddPaymentType = () => {
    paymentTypeStore.setIsOpenAddEditPaymentTypeModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    paymentTypeStore.setName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    paymentTypeStore.setPageNumber(page);
    paymentTypeStore.setPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('payment-type__head')}>
        <Typography.Title level={3}>Вид оплаты</Typography.Title>
        <div className={cn('payment-type__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('payment-type__search')}
          />
          <Button
            onClick={handleAddPaymentType}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый вид оплаты
          </Button>
        </div>
      </div>

      <DataTable
        columns={paymentTypeColumns}
        data={paymentTypeData?.paymentTypeList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: paymentTypeData?.count,
          current: paymentTypeStore?.pageNumber,
          pageSize: paymentTypeStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(paymentTypeData?.count),
        }}
      />

      {paymentTypeStore.isOpenAddEditPaymentTypeModal && <AddEditPaymentTypeModal />}
    </main>
  );
});
