import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Typography} from 'antd';
import classNames from 'classnames/bind';
import {useMediaQuery} from 'usehooks-ts';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {storekeeperRequestStore} from '@/stores/storekeeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {requestColumns} from './constants';
import styles from './request.scss';

const cn = classNames.bind(styles);

export const Request = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: requestsToWarehouse, isLoading: requestLoading} = useQuery({
    queryKey: ['getRequestToWarehouse',
      storekeeperRequestStore.pageSize,
      storekeeperRequestStore.pageNumber],
    queryFn: () => storekeeperApi.getRequestToWarehouse(
      {
        pageSize: storekeeperRequestStore.pageSize,
        pageNumber: storekeeperRequestStore.pageNumber,
      }
    ),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    storekeeperRequestStore.setPageNumber(page);
    storekeeperRequestStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    storekeeperRequestStore.setRequestFilter(null);
    storekeeperRequestStore.setSearch(null);
  }, []);

  return (
    <>
      <div className={cn('request__header')}>
        <Typography.Title level={3}>
            Приход
        </Typography.Title>
      </div>

      <DataTable
        columns={requestColumns}
        loading={requestLoading}
        data={requestsToWarehouse?.requestsList || []}
        isMobile={isMobile}
        pagination={{
          total: requestsToWarehouse?.count,
          current: storekeeperRequestStore.pageNumber,
          pageSize: storekeeperRequestStore.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(requestsToWarehouse?.count),
        }}
      />
    </>
  );
});
