import React, {useCallback, useMemo} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Select, Typography} from 'antd';
import classNames from 'classnames/bind';
import {usersApi} from '@/api/users/users';
import {DataTable} from '@/components/Datatable/datatable';
import {pmProviderStore} from '@/stores/productManager';
import {usersStore} from '@/stores/users';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditProvider} from './AddEditProvider';
import {providerListColumns} from './constants';
import {ErrorModal} from './ErrorModal';
import {styles} from './manager-provider.scss';

const cn = classNames.bind(styles);

export const ManagerProvider = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: companiesAllData} = useQuery({
    queryKey: ['getAllCompanies'],
    queryFn: () => usersStore.getAllCompanies(),
  });

  const {data: providerData, isLoading: loading} = useQuery({
    queryKey: ['getManagerProvider',
      pmProviderStore.pageNumber,
      pmProviderStore.pageSize,
      pmProviderStore.company,
      pmProviderStore.search],
    queryFn: () => usersApi.getProvider({
      pageNumber: pmProviderStore.pageNumber,
      pageSize: pmProviderStore.pageSize,
      companyId: pmProviderStore.company!,
      search: pmProviderStore.search!,
    }),
  });

  const handleCompanyFilter = (value: string) => {
    pmProviderStore.setCompany(value);
  };

  const handleSearchNameAndPhone = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pmProviderStore.setSearch(event?.currentTarget?.value);
  };

  const handlePageChange = useCallback((page: number, pageSize: number | undefined) => {
    pmProviderStore.setPageSize(pageSize!);
    pmProviderStore.setPageNumber(page);
  }, []);

  const handleAddNewProduct = () => {
    pmProviderStore.setIsOpenAddEditProviderModal(true);
  };

  // SELECT OPTIONS
  const companyOptions = useMemo(() => (
    companiesAllData?.map((company) => ({
      value: company?.id,
      label: company?.name,
    }))
  ), [companiesAllData]);

  return (
    <>
      <div className={cn('provider-header')}>
        <Typography.Title level={3}>Поставщик</Typography.Title>
        <div className={cn('provider-filter__wrapper')}>
          <Select
            options={companyOptions}
            onChange={handleCompanyFilter}
            placeholder="Поиск по компании"
            className={cn('provider-filter__search')}
            allowClear
          />
          <Input
            onChange={handleSearchNameAndPhone}
            placeholder="Поиск по названия и телефона"
            className={cn('provider-filter__search')}
            allowClear
          />

          <Button
            onClick={handleAddNewProduct}
            type="primary"
            icon={<PlusOutlined />}
          >
              Новый поставщик
          </Button>
        </div>
      </div>


      <DataTable
        loading={loading}
        columns={providerListColumns}
        data={providerData?.userList || []}
        isMobile={isMobile}
        pagination={{
          total: providerData?.count,
          current: providerData?.pageNumber,
          pageSize: providerData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(providerData?.count),
        }}
      />

      {pmProviderStore.isOpenAddEditProviderModal && <AddEditProvider />}
      {pmProviderStore.whileAddUserIsHaveUserError && <ErrorModal />}
    </>
  );
});
