import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {expenseTypeApi} from '@/api/expenseType/expenseType';
import {DataTable} from '@/components/Datatable/datatable';
import {pmExpenseStore} from '@/stores/productManager';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditExpenseModal} from './AddEditExpenseModal';
import {expenseColumns} from './constants';
import styles from './expense.scss';

const cn = classNames.bind(styles);

export const Expense = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: expenseTypeData, isLoading: loading} = useQuery({
    queryKey: [
      'getExpenseType',
      pmExpenseStore.pageNumber,
      pmExpenseStore.pageSize,
      pmExpenseStore.name,
    ],
    queryFn: () =>
      expenseTypeApi.getExpenseType({
        pageNumber: pmExpenseStore.pageNumber,
        pageSize: pmExpenseStore.pageSize,
        name: pmExpenseStore.name!,
      }),
  });

  const handleAddExpense = () => {
    pmExpenseStore.setIsOpenAddEditExpenseModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pmExpenseStore.setName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    pmExpenseStore.setPageNumber(page);
    pmExpenseStore.setPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('expense__head')}>
        <Typography.Title level={3}>Категория расходов</Typography.Title>
        <div className={cn('expense__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('expense__search')}
          />
          <Button
            onClick={handleAddExpense}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый категория расходов
          </Button>
        </div>
      </div>

      <DataTable
        columns={expenseColumns}
        data={expenseTypeData?.spendTypeList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: expenseTypeData?.count,
          current: pmExpenseStore?.pageNumber,
          pageSize: pmExpenseStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(expenseTypeData?.count),
        }}
      />

      {pmExpenseStore.isOpenAddEditExpenseModal && <AddEditExpenseModal />}
    </main>
  );
});
