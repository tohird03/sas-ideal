import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {DataTable} from '@/components/Datatable/datatable';
import {requestStore} from '@/stores/dms';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {rewardColumns} from './constants';
import {Filter} from './Filter';
import {RewardInfoModal} from './RewardInfoModal';

export const Reward = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: closedFlightsData, isLoading: loading} = useQuery({
    queryKey: [
      'getClosedFlights',
      requestStore.closedFlightPageNumber,
      requestStore.closedFlightPageSize,
      requestStore.closedFlightNameSearch,
      requestStore.closedFlightPhoneSearch,
      requestStore.closedFlightStartDate,
      requestStore.closedFlightEndDate,
    ],
    queryFn: () => requestStore.getClosedFlights({
      pageNumber: requestStore.closedFlightPageNumber,
      pageSize: requestStore.closedFlightPageSize,
      name: requestStore.closedFlightNameSearch!,
      phone: requestStore.closedFlightPhoneSearch!,
      startDate: requestStore.closedFlightStartDate,
      endDate: requestStore.closedFlightEndDate,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    requestStore.setClosedFlightPageNumber(page);
    requestStore.setClosedPageSize(pageSize!);
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
          current: requestStore?.closedFlightPageNumber,
          pageSize: requestStore?.closedFlightPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(closedFlightsData?.count),
        }}
      />

      {requestStore.isOpenClosedFlightInfoModal && <RewardInfoModal />}
    </>
  );
});
