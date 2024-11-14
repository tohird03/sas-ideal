import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {sellerVisitedClientsApi} from '@/api/seller';
import {DataTable} from '@/components/Datatable/datatable';
import {visitedClientsStore} from '@/stores/seller';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddVisitedClientModal} from './AddVisitedClientModal';
import {rewardColumns} from './constants';
import {Filter} from './Filter';

export const AboutVisitedClients = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: closedFlightsData, isLoading: loading} = useQuery({
    queryKey: [
      'getVisitedClients',
      visitedClientsStore.pageNumber,
      visitedClientsStore.pageSize,
      visitedClientsStore.search,
      visitedClientsStore.fromDate,
      visitedClientsStore.toDate,
    ],
    queryFn: () => sellerVisitedClientsApi.getAboutVisitedClients({
      pageNumber: visitedClientsStore.pageNumber,
      pageSize: visitedClientsStore.pageSize,
      fromDate: visitedClientsStore.fromDate!,
      toDate: visitedClientsStore.toDate!,
      search: visitedClientsStore.search!,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    visitedClientsStore.setPageNumber(page);
    visitedClientsStore.setPageSize(pageSize!);
  };

  return (
    <>
      <Filter />
      <DataTable
        columns={rewardColumns}
        data={closedFlightsData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: closedFlightsData?.count,
          current: visitedClientsStore?.pageNumber,
          pageSize: visitedClientsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(closedFlightsData?.count),
        }}
      />

      {visitedClientsStore.isOpenAddNewVisitedClient && <AddVisitedClientModal />}
    </>
  );
});
