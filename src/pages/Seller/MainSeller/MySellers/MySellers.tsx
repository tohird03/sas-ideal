import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {usersApi} from '@/api/users/users';
import {DataTable} from '@/components/Datatable/datatable';
import {mainSellerMyUsersStore} from '@/stores/seller';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {myUsersColumns} from './constants';
import styles from './my-sellers.scss';
import {MySellerAddEditModal} from './MySellerAddEditModal';
import {ErrorModal} from './MySellerAddEditModal/ErrorModal';

const cn = classNames.bind(styles);

export const MySellers = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: myUsersData, isLoading: loading} = useQuery({
    queryKey: [
      'getMyUsers',
      mainSellerMyUsersStore.pageNumber,
      mainSellerMyUsersStore.pageSize,
      mainSellerMyUsersStore.search,
    ],
    queryFn: () => usersApi.getMainSellerUsers({
      pageNumber: mainSellerMyUsersStore.pageNumber,
      pageSize: mainSellerMyUsersStore.pageSize,
      search: mainSellerMyUsersStore.search!,
    }),
  });

  const handleAddSeller = () => {
    mainSellerMyUsersStore.setIsOpenAddEditCourierModal(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    mainSellerMyUsersStore.setSearch(event.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    mainSellerMyUsersStore.setPageNumber(page);
    mainSellerMyUsersStore.setPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('courier__head')}>
        <Typography.Title level={3}>Мой выставочный зал</Typography.Title>
        <div className={cn('courier__filter')}>
          <Input
            placeholder="Поиск"
            allowClear
            onChange={handleSearch}
            className={cn('courier__search')}
          />
          <Button
            onClick={handleAddSeller}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый продавец
          </Button>
        </div>
      </div>

      <DataTable
        columns={myUsersColumns}
        data={myUsersData?.userList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: myUsersData?.count,
          current: mainSellerMyUsersStore?.pageNumber,
          pageSize: mainSellerMyUsersStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(myUsersData?.count),
        }}
      />

      {mainSellerMyUsersStore.isOpenAddEditCourierModal && <MySellerAddEditModal />}
      {mainSellerMyUsersStore.isOpenHaveOldUserUpdate && <ErrorModal />}
    </>
  );
});
