import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, DatePicker, Input, Table, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditModal} from './AddEditModal';
import styles from './payments.scss';
import {paymentsColumns} from './constants';
import { paymentsStore } from '@/stores/clients';
import dayjs from 'dayjs';

const cn = classNames.bind(styles);

export const ClientsPayments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: paymentsData, isLoading: loading} = useQuery({
    queryKey: [
      'getPayments',
      paymentsStore.pageNumber,
      paymentsStore.pageSize,
      paymentsStore.search,
      paymentsStore.startDate,
      paymentsStore.endDate,
    ],
    queryFn: () =>
      paymentsStore.getClientsPayments({
        pageNumber: paymentsStore.pageNumber,
        pageSize: paymentsStore.pageSize,
        search: paymentsStore.search!,
        startDate: paymentsStore?.startDate!,
        endDate: paymentsStore?.endDate!,
      }),
  });

  const handleAddNewPayment = () => {
    paymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    paymentsStore.setSearch(e.currentTarget?.value);
  };

  const handleDateChange = (values: any) => {
    if (values) {
      paymentsStore.setStartDate(new Date(values[0]));
      paymentsStore.setEndDate(new Date(values[1]));
    } else {
      paymentsStore.setStartDate(null);
      paymentsStore.setEndDate(null);
    }
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
          <DatePicker.RangePicker
            className={cn('promotion__datePicker')}
            onChange={handleDateChange}
            placeholder={['Boshlanish sanasi', 'Tugash sanasi']}
            defaultValue={[dayjs(paymentsStore.startDate), dayjs(paymentsStore.endDate)]}
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

      <Table
        columns={paymentsColumns}
        dataSource={paymentsData?.data || []}
        loading={loading}
        pagination={{
          total: paymentsData?.totalCount,
          current: paymentsStore?.pageNumber,
          pageSize: paymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(paymentsData?.totalCount),
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {paymentsData?.totalCalc?.totalCash}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {paymentsData?.totalCalc?.totalCard}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {paymentsData?.totalCalc?.totalTransfer}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {paymentsData?.totalCalc?.totalOther}
              </div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {paymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
