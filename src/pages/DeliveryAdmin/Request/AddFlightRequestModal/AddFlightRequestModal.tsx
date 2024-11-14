import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Modal} from 'antd';
import {requestApi} from '@/api/dmsRequest';
import {DataTable} from '@/components/Datatable/datatable';
import {requestStore} from '@/stores/dms';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {addFlightRequestCol} from './constants';

export const AddFlightRequestModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: requestsData, isLoading: loading} = useQuery({
    queryKey: [
      'getRequests',
      requestStore.requestPageNumber,
      requestStore.requestPageSize,
    ],
    queryFn: () => requestApi.getRequests({
      pageNumber: requestStore.requestPageNumber,
      pageSize: requestStore.requestPageSize,
    }),
  });

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    requestStore.setRequestPageNumber(page);
    requestStore.setRequestPageSize(pageSize!);
  };

  const handleModalClose = () => {
    requestStore.setIsOpenAddFlightRequestModal(false);
  };

  useEffect(() => () => {
    requestStore.setIsOpenAddFlightRequestModal(false);
  }, []);

  return (
    <Modal
      open={requestStore.isOpenAddFlightRequestModal}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
      title="В какую заявку вы хотите создать рейс?"
      width={1200}
    >
      <DataTable
        columns={addFlightRequestCol}
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
    </Modal>
  );
});
