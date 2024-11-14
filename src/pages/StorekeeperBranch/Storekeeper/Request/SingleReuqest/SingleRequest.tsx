import React from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {FilterOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {useMediaQuery} from 'usehooks-ts';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {storekeeperRequestStore} from '@/stores/storekeeper';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {requestColumns} from '../constants';
import styles from '../request.scss';
import {AddProductModal} from './AddProductModal';
import {singleRequestColumns} from './constants';
import {FilterModal} from './FilterModal';

const cn = classNames.bind(styles);

export const SingleRequest = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {requestId} = useParams();

  const {data: singleRequest, isLoading: singleRequestLoading} = useQuery({
    queryKey: ['getSingleRequest', requestId],
    queryFn: () => mainStorekeeperApi.getByIdRequest(requestId!),
  });

  const {data: requestToWarehouseProducts, isLoading: requestLoading} = useQuery({
    queryKey: ['getSingleRequest',
      storekeeperRequestStore.singleRequestProductPageSize,
      storekeeperRequestStore.singleRequestProductPageNumber,
      storekeeperRequestStore.requestFilter,
      storekeeperRequestStore.search],
    queryFn: () => storekeeperApi.getSingleRequestProducts({
      pageSize: storekeeperRequestStore.singleRequestProductPageSize,
      pageNumber: storekeeperRequestStore.singleRequestProductPageNumber,
      requestId: requestId!,
      name: storekeeperRequestStore.search!,
      ...storekeeperRequestStore.requestFilter,
    }),
  });

  const handleOpenFilterModal = () => {
    storekeeperRequestStore.setIsOpenFilterModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    storekeeperRequestStore.setSearch(e.target.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    storekeeperRequestStore.setSingleRequestProductPageNumber(page);
    storekeeperRequestStore.setSingleRequestProductPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('request__header')}>
        <Typography.Title level={3}>
            Приход
        </Typography.Title>
      </div>
      <DataTable
        columns={requestColumns}
        loading={singleRequestLoading}
        data={[singleRequest]}
        isMobile={isMobile}
        pagination={false}
      />

      <div className={cn('request__header')}>
        <Typography.Title level={3}>
          Продукты
        </Typography.Title>
        <div className={cn('request__header-actions')}>
          <Button
            onClick={handleOpenFilterModal}
          >
            Фильтр <FilterOutlined />
          </Button>

          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
          />
        </div>
      </div>

      <DataTable
        columns={singleRequestColumns}
        loading={requestLoading}
        data={requestToWarehouseProducts?.requestsProductList || []}
        isMobile={isMobile}
        pagination={{
          total: requestToWarehouseProducts?.count,
          current: storekeeperRequestStore.singleRequestProductPageNumber,
          pageSize: storekeeperRequestStore.singleRequestProductPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(requestToWarehouseProducts?.count),
        }}
      />

      {storekeeperRequestStore.isOpenAddProductModal && <AddProductModal />}
      {storekeeperRequestStore.isOpenFilterModal && <FilterModal />}

    </>
  );
});
