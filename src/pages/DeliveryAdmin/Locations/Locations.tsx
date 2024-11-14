import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {locationApi} from '@/api/locations/locations';
import {DataTable} from '@/components/Datatable/datatable';
import {locationsStore} from '@/stores/dms';
import {processStore} from '@/stores/process';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditLocationModal} from './AddEditLocationModal';
import {locationsColumn} from './constants';
import styles from './locations.scss';

const cn = classNames.bind(styles);

export const Locations = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: locations, isLoading: loading} = useQuery({
    queryKey: [
      'getLocations',
      locationsStore.pageNumber,
      locationsStore.pageSize,
      locationsStore.name,
    ],
    queryFn: () => locationApi.getLocations({
      pageNumber: locationsStore?.pageNumber,
      pageSize: locationsStore?.pageSize,
      name: locationsStore?.name!,
    }),
  });

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    locationsStore.setName(e.currentTarget.value.trim());
  };

  const handleAddLocation = () => {
    locationsStore.setIsOpenAddEditLocationModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    locationsStore.setPageNumber(page);
    locationsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    processStore.setSearch('');
  }, []);

  return (
    <>
      <div className={cn('locations__head')}>
        <Typography.Title level={3}>Локации</Typography.Title>
        <div className={cn('locations__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('locations__search')}
          />
          <Button
            onClick={handleAddLocation}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый локации
          </Button>
        </div>
      </div>

      <DataTable
        columns={locationsColumn}
        data={locations?.locationList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: locations?.count,
          current: locationsStore?.pageNumber,
          pageSize: locationsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(locations?.count),
        }}
      />

      {locationsStore.isOpenAddEditLocationModal && <AddEditLocationModal />}
    </>
  );
});
