import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {useMediaQuery} from 'usehooks-ts';
import {DataTable} from '@/components/Datatable/datatable';
import {companysStore} from '@/stores/company';
import {getPaginationParams} from '../utils';
import styles from './company.scss';
import {companyColumns} from './constants';
import {CompanysDynamicModal} from './EditModal';

const cn = classNames.bind(styles);

export const Companies = observer(() => {
  const isMobile = useMediaQuery('(max-width: 650px)');

  const {data: companysData, isLoading: loading} = useQuery({
    queryKey: ['getCompanys', companysStore.pageNumber, companysStore.name, companysStore.pageSize],
    queryFn: () =>
      companysStore.getCompanys({
        pageNumber: companysStore.pageNumber,
        pageSize: companysStore.pageSize,
        name: companysStore.name,
      }),
  });

  const handleCompanySearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    companysStore.setName(event.currentTarget.value);
  };

  useEffect(() => () => {
    companysStore.setName('');
  }, []);

  const handleOpenModal = () => {
    companysStore.setDynamicModalOpenOrClose(true);
  };

  const handelClearValues = () => {
    companysStore.setCompany(null);
  };

  const handleClickNewCompanies = () => {
    handelClearValues();
    handleOpenModal();
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    companysStore.setPageNumber(page);
    companysStore.setPageSize(pageSize!);
  };

  return (
    <>
      <div className={cn('companyPageWrapper')}>
        <div className={cn('companyPageHEader')}>
          <Typography.Title level={5}>Компании</Typography.Title>
          <div className={cn('headerSearchWrapp')}>
            <Input onChange={handleCompanySearch} placeholder="Поиск" addonAfter={<SearchOutlined />} />
            <Button
              type="primary"
              onClick={handleClickNewCompanies}
              icon={<PlusOutlined />}
              className={cn('addCompanyButton')}
            >
              Создать новое
            </Button>
          </div>
        </div>
        <DataTable
          columns={companyColumns}
          data={companysData?.companyList || []}
          isMobile={isMobile}
          loading={loading}
          pagination={{
            total: companysData?.count,
            current: companysStore?.pageNumber,
            pageSize: companysStore?.pageSize,
            showSizeChanger: true,
            onChange: handlePageChange,
            ...getPaginationParams(companysData?.count),
          }}
        />

        {companysStore.dynamicModalOpen && <CompanysDynamicModal />}
      </div>
    </>
  );
});
