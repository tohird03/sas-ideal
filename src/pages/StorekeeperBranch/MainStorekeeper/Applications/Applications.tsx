import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {getPaginationParams} from '@/pages/utils';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {useMediaQuery} from '@/utils/mediaQuery';
import {applicationsColumns} from './constants';
import {FilterApplications} from './FilterApplications/FilterApplications';

export const Applications = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    mainStorekeeperStore.setApplicationsPageSize(pageSize!);
    mainStorekeeperStore.setApplicationsPageNumber(page);
  };

  const {data: applicationsData, isLoading: applicationsDataLoading} =
    useQuery({
      queryKey: [
        'getAllApplications',
        mainStorekeeperStore.applicationsPageNumber,
        mainStorekeeperStore.applicationsPageSize,
        mainStorekeeperStore.filterApplicationsParams,
      ],
      queryFn: () =>
        mainStorekeeperApi.getRequests({
          pageNumber: mainStorekeeperStore.applicationsPageNumber,
          pageSize: mainStorekeeperStore.applicationsPageSize,
          ...mainStorekeeperStore.filterApplicationsParams,
        }),
    });


  return (
    <>
      <FilterApplications />
      <DataTable
        loading={applicationsDataLoading}
        data={applicationsData?.requestsList || []}
        columns={applicationsColumns}
        isMobile={isMobile}
        pagination={{
          total: applicationsData?.count,
          current: applicationsData?.pageNumber,
          pageSize: applicationsData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(applicationsData?.count),
        }}
      />
    </>
  );
});
