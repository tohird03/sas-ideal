import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {processStore} from '@/stores/process';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddProcessModal} from './AddProcessModal';
import {processColumns} from './constants';
import styles from './process.scss';

const cn = classNames.bind(styles);

export const Process = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: process, isLoading: loading} = useQuery({
    queryKey: [
      'getProcess',
      processStore.pageNumber,
      processStore.pageSize,
      processStore.search,
    ],
    queryFn: () =>
      processStore.getProcess({
        pageNumber: processStore.pageNumber,
        pageSize: processStore.pageSize,
        description: processStore.search,
      }),
  });

  const handleAddUser = () => {
    processStore.setIsOpenNewProcessModal(true);
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    processStore.setSearch(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    processStore.setPageNumber(page);
    processStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    processStore.setSearch('');
  }, []);

  return (
    <main>
      <div className={cn('process__head')}>
        <Typography.Title level={3}>Процессы</Typography.Title>
        <div className={cn('process__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('process__search')}
          />
          <Button
            onClick={handleAddUser}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый процесс
          </Button>
        </div>
      </div>

      <DataTable
        columns={processColumns}
        data={process?.processList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: process?.count,
          current: processStore?.pageNumber,
          pageSize: processStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(process?.count),
        }}
      />

      {processStore.isOpenAddNewProcessModal && <AddProcessModal />}
    </main>
  );
});
