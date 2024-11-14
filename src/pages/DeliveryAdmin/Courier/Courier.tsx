import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {courierApi} from '@/api/courier';
import {DataTable} from '@/components/Datatable/datatable';
import {courierStores} from '@/stores/dms';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {courierColumns} from './constants';
import styles from './courier.scss';
import {CourierAddEditModal} from './CourierAddEditModal';
import {ErrorModal} from './CourierAddEditModal/ErrorModal';

const cn = classNames.bind(styles);

export const Courier = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: couriersData, isLoading: loading} = useQuery({
    queryKey: [
      'getCouriers',
      courierStores.pageNumber,
      courierStores.pageSize,
      courierStores.searchName,
      courierStores.searchPhone,
    ],
    queryFn: () => courierApi.getCouriers({
      pageNumber: courierStores.pageNumber,
      pageSize: courierStores.pageSize,
      name: courierStores.searchName!,
      phone: courierStores.searchPhone!,
    }),
  });

  const handleAddCourier = () => {
    courierStores.setIsOpenAddEditCourierModal(true);
  };

  const handleSearchName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    courierStores.setSearchName(event.currentTarget.value.trim());
  };

  const handleSearchPhone = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    courierStores.setSearchPhone(event.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    courierStores.setPageNumber(page);
    courierStores.setPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('courier__head')}>
        <Typography.Title level={3}>Курьер</Typography.Title>
        <div className={cn('courier__filter')}>
          <Input
            placeholder="Поиск по имени"
            allowClear
            onChange={handleSearchName}
            className={cn('courier__search')}
          />
          <Input
            placeholder="Поиск по номеру телефона"
            allowClear
            onChange={handleSearchPhone}
            className={cn('courier__search')}
          />
          <Button
            onClick={handleAddCourier}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый курьер
          </Button>
        </div>
      </div>

      <DataTable
        columns={courierColumns}
        data={couriersData?.courierList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: couriersData?.count,
          current: courierStores?.pageNumber,
          pageSize: courierStores?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(couriersData?.count),
        }}
      />

      {courierStores.isOpenAddEditCourierModal && <CourierAddEditModal />}
      {courierStores.isOpenHaveOldUserUpdate && <ErrorModal />}
    </>
  );
});
