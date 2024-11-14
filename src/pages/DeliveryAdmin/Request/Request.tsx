import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import classNames from 'classnames/bind';
import {requestApi} from '@/api/dmsRequest';
import {DataTable} from '@/components/Datatable/datatable';
import {requestStore} from '@/stores/dms';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddFlightRequestModal} from './AddFlightRequestModal';
import {requestColumns} from './constants';
import {CourierFlights} from './CourierFlights';
import {Filter} from './Filter';
import {FlightInfoModal} from './FlightInfoModal';
import styles from './request.scss';
import {RequestInfoModal} from './RequestInfoModal';

const cn = classNames.bind(styles);

export const Request = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: requestsData, isLoading: loading} = useQuery({
    queryKey: [
      'getRequests',
      requestStore.requestPageNumber,
      requestStore.requestPageSize,
      requestStore.requestAndFlightClientSearch,
      requestStore.requestAndFlightRequestIdSearch,
      requestStore.requestAndFlightProductIdSearch,
      requestStore.requestAndFlightRequestrSearch,
    ],
    queryFn: () => requestApi.getRequests({
      pageNumber: requestStore.requestPageNumber,
      pageSize: requestStore.requestPageSize,
      client: requestStore.requestAndFlightClientSearch!,
      requestId: requestStore.requestAndFlightRequestIdSearch!,
      productId: requestStore.requestAndFlightProductIdSearch!,
      flag: requestStore.requestAndFlightRequestrSearch!,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    requestStore.setRequestPageNumber(page);
    requestStore.setRequestPageSize(pageSize!);
  };

  return (
    <>
      <Filter />
      <div className={cn('request__data-warpper')}>
        <div className={cn('request__collapse')}>
          <CourierFlights />
        </div>
        <div className={cn('request__table')}>
          <DataTable
            columns={requestColumns}
            data={requestsData?.requestsList || []}
            loading={loading}
            isMobile={isMobile}
            pagination={{
              total: requestsData?.count,
              current: requestStore?.requestPageNumber,
              pageSize: requestStore?.requestPageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(requestsData?.count),
            }}
          />
        </div>
      </div>

      {requestStore?.isOpenRequestInfoModal && <RequestInfoModal />}
      {requestStore?.isOpenFlightInfoModal && <FlightInfoModal />}
      {requestStore.isOpenAddFlightRequestModal && <AddFlightRequestModal />}
    </>
  );
});
