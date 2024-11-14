import React, {useCallback} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {usersApi} from '@/api/users/users';
import {DataTable} from '@/components/Datatable/datatable';
import {myUsersStore} from '@/stores/provider';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditProvider} from './AddEditUsers';
import {myUsersListColumns} from './constants';
import {ErrorModal} from './ErrorModal';
import {styles} from './my-users.scss';
import {RolesModal} from './RolesModal';

const cn = classNames.bind(styles);

export const MyUsers = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: myUsersData, isLoading: loading} = useQuery({
    queryKey: ['getMyUsers',
      myUsersStore.pageNumber,
      myUsersStore.pageSize,
      myUsersStore.search],
    queryFn: () => usersApi.getProviderUsers({
      pageNumber: myUsersStore.pageNumber,
      pageSize: myUsersStore.pageSize,
      search: myUsersStore.search!,
    }),
  });

  const handleSearchNameAndPhone = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    myUsersStore.setSearch(event?.currentTarget?.value);
  };


  const handlePageChange = useCallback((page: number, pageSize: number | undefined) => {
    myUsersStore.setPageSize(pageSize!);
    myUsersStore.setPageNumber(page);
  }, []);

  const handleAddUser = () => {
    myUsersStore.setIsOpenAddEditUserModal(true);
  };

  return (
    <>
      <div className={cn('my-users__header')}>
        <Typography.Title level={3}>Пользователи</Typography.Title>
        <div className={cn('my-users__filters')}>
          <Input
            onChange={handleSearchNameAndPhone}
            placeholder="Поиск по названия и телефона"
            className={cn('my-users__search')}
          />
          <Button
            onClick={handleAddUser}
            type="primary"
            icon={<PlusOutlined />}
          >
              Новый пользователь
          </Button>
        </div>
      </div>


      <DataTable
        loading={loading}
        columns={myUsersListColumns}
        data={myUsersData?.userList || []}
        isMobile={isMobile}
        pagination={{
          total: myUsersData?.count,
          current: myUsersData?.pageNumber,
          pageSize: myUsersData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(myUsersData?.count),
        }}
      />

      {myUsersStore.isOpenAddEditUserModal && <AddEditProvider />}
      {myUsersStore.isOpenHaveUserErrorModal && <ErrorModal />}
      {myUsersStore.isOpenRolesModal && <RolesModal />}
    </>
  );
});
