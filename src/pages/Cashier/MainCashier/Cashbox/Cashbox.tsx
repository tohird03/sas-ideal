import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {cashboxApi} from '@/api/cashbox';
import {DataTable} from '@/components/Datatable/datatable';
import {cashboxStore} from '@/stores/cashier';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditCashboxModal} from './AddEditCashboxModal';
import styles from './cashbox.scss';
import {cashboxColumns} from './constants';
import {SpendMoneyModal} from './SpendMoneyModal';
import {TransferMoneyModal} from './TransferMoneyModal';

const cn = classNames.bind(styles);

export const Cashbox = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: cashboxData, isLoading: loading} = useQuery({
    queryKey: [
      'getCashbox',
      cashboxStore.pageNumber,
      cashboxStore.pageSize,
      cashboxStore.search,
    ],
    queryFn: () =>
      cashboxApi.getCashbox({
        pageNumber: cashboxStore.pageNumber,
        pageSize: cashboxStore.pageSize,
        name: cashboxStore.search!,
      }),
  });

  const handleAddCashbox = () => {
    cashboxStore.setIsOpenAddEditCashboxModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    cashboxStore.setSearch(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    cashboxStore.setPageNumber(page);
    cashboxStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    cashboxStore.setSearch(null);
  }, []);

  return (
    <main>
      <div className={cn('cashbox__head')}>
        <Typography.Title level={3}>Кассы</Typography.Title>
        <div className={cn('cashbox__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('cashbox__search')}
          />
          <Button
            onClick={handleAddCashbox}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новая касса
          </Button>
        </div>
      </div>

      <DataTable
        columns={cashboxColumns}
        data={cashboxData?.cashboxList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: cashboxData?.count,
          current: cashboxStore?.pageNumber,
          pageSize: cashboxStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(cashboxData?.count),
        }}
      />

      {cashboxStore.isOpenAddEditCashboxModal && <AddEditCashboxModal />}
      {cashboxStore.isOpenTransferMoneyModal && <TransferMoneyModal />}
      {cashboxStore.isOpenSpendMoneyModal && <SpendMoneyModal />}
    </main>
  );
});
