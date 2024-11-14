import React, {useCallback} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {cashierApi} from '@/api/cashier';
import {DataTable} from '@/components/Datatable/datatable';
import {cashierUserStore} from '@/stores/cashier';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditCashier} from './AddEditCashier';
import {styles} from './cashier.scss';
import {providerListColumns} from './constants';
import {ErrorModal} from './ErrorModal';

const cn = classNames.bind(styles);

export const Cashier = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: cashierData, isLoading: loading} = useQuery({
    queryKey: ['getCashier',
      cashierUserStore.pageNumber,
      cashierUserStore.pageSize,
      cashierUserStore.search],
    queryFn: () => cashierApi.getCashier({
      pageNumber: cashierUserStore.pageNumber,
      pageSize: cashierUserStore.pageSize,
      search: cashierUserStore.search!,
    }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    cashierUserStore.setSearch(e.currentTarget.value.trim());
  };


  const handlePageChange = useCallback((page: number, pageSize: number | undefined) => {
    cashierUserStore.setPageSize(pageSize!);
    cashierUserStore.setPageNumber(page);
  }, []);

  const handleAddNewCashier = () => {
    cashierUserStore.setIsOpenAddEditCashierModal(true);
  };

  return (
    <>
      <div className={cn('cashier-header')}>
        <Typography.Title level={3}>Кассиры</Typography.Title>
        <div>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('cashbox__search')}
          />
          <Button
            onClick={handleAddNewCashier}
            type="primary"
            icon={<PlusOutlined />}
          >
            Добавить кассира
          </Button>
        </div>
      </div>


      <DataTable
        loading={loading}
        columns={providerListColumns}
        data={cashierData?.userList || []}
        isMobile={isMobile}
        pagination={{
          total: cashierData?.count,
          current: cashierUserStore?.pageNumber,
          pageSize: cashierUserStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(cashierData?.count),
        }}
      />

      {cashierUserStore.isOpenAddEditCashierModal && <AddEditCashier />}
      {cashierUserStore.isOpenWhileAddUserIsHaveUserErrorModal && <ErrorModal />}
    </>
  );
});
