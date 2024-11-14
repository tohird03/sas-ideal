import React, {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {CheckOutlined, ControlOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Breadcrumb, Button, Col, Dropdown, MenuProps, Row, Typography} from 'antd';
import classnamesBind from 'classnames/bind';
import {useMediaQuery} from 'usehooks-ts';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {DataTable} from '@/components/Datatable/datatable';
import {ROUTES} from '@/constants';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import styles from '../apllications.scss';
import {localApplicationColumn, requestProductsColumn} from '../constants';
import {AddPorductApplicationModal} from './AddPorductApplicationModal/AddPorductApplicationModal';
import {ApplicationAddEditModal} from './ApplicationAddEditModal/ApplicationAddEditModal';
import {ApplicationProductEditModal} from './ApplicationProductEditModal/ApplicationProductEditModal';
const cn = classnamesBind.bind(styles);

export const ApplicationAddEdit = observer(() => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const {id} = useParams();
  const handleOpenAddApplicationModal = () => {
    mainStorekeeperStore.setIsOpneAddApplicationModal(true);
  };

  const handleOpenAddProductModal = () => {
    mainStorekeeperStore.setisOpenAddProductApplicationModal(true);
  };

  const {data: byIdApplication, isLoading: byIdApplicationLoading} = useQuery(
    {
      queryKey: ['getByIdApplication', mainStorekeeperStore.localApplication, id],
      queryFn: () => id
        ? mainStorekeeperApi.getByIdRequest(
          id!
        ) : mainStorekeeperStore.localApplication?.id! ? mainStorekeeperApi.getByIdRequest(
          mainStorekeeperStore.localApplication?.id!
        ) : null,

    }
  );

  const {data: byIdProduct, isLoading: byIdProductLoading} = useQuery({
    queryKey: [
      'getByIdProduct',
      mainStorekeeperStore.localApplication,
      id,
    ],
    queryFn: () =>
      id
        ? mainStorekeeperApi.getRequstProducts({
          pageNumber: 1,
          pageSize: 100,
          requestId: id!,
        })
        : mainStorekeeperStore.localApplication?.id!
          ? mainStorekeeperApi.getRequstProducts({
            pageNumber: 1,
            pageSize: 100,
            requestId: mainStorekeeperStore.localApplication?.id!,
          }) : null,
  });


  useEffect(() => {
    const item = localStorage.getItem('request');

    if (byIdProduct) {
      mainStorekeeperStore.setLocalReqProducts(
        byIdProduct?.requestsProductList
      );
    }

    if (byIdApplication) {
      mainStorekeeperStore.setLocalApplication(byIdApplication);
    } else if (item) {
      mainStorekeeperStore.setLocalApplication(JSON.parse(item));
    } else {
      mainStorekeeperStore.setLocalApplication(null);
    }
  }, [
    localStorage,
    window.location.pathname,
    id,
    byIdApplication,
    byIdProduct,
  ]);

  const items: MenuProps['items'] = [
    {
      label: (
        <>
          <CheckOutlined /> Стандарт
        </>
      ),
      key: '0',
      onClick: handleOpenAddProductModal,
    },
    {
      label: (
        <>
          <ControlOutlined /> Не стандарт
        </>
      ),
      key: '1',
    },
  ];

  return (
    <>
      <Breadcrumb
        style={{marginBottom: '20px'}}
        separator="/"
        items={[
          {
            title: <Link to={ROUTES.mainStorekeeperApplications}>Заявки</Link>,
          },
          {
            title: 'Новая заявка',
          },
        ]}
      />
      <Row gutter={24}>
        <Col lg={10} xl={10} md={24} sm={24} xs={24}>
          <div className={cn('appllicationsWrapp')}>
            <div className={cn('applicationHeaderWrapp')}>
              <Typography.Title level={4}>
                Заявка № {byIdApplication?.requestId || ''}
              </Typography.Title>
            </div>
            {
              <DataTable
                loading={byIdApplicationLoading}
                data={byIdApplication ? [byIdApplication] : []}
                columns={localApplicationColumn}
                loadingLength={1}
                isMobile
              />
            }
            <Button
              onClick={handleOpenAddApplicationModal}
              type="primary"
              icon={
                mainStorekeeperStore.localApplication ? (
                  <EditOutlined />
                ) : (
                  <PlusCircleOutlined />
                )
              }
            >
              {mainStorekeeperStore.localApplication ? 'Изменить' : 'Новый'}
            </Button>
          </div>
        </Col>
        <Col lg={14} xl={14} md={24} sm={24} xs={24}>
          <div className={cn('applicationProductsWrapp')}>
            <div className={cn('addProdyctInApplicationWrapp')}>
              <Typography.Title level={4}>Продукты</Typography.Title>

              <Dropdown menu={{items}} trigger={['click']}>
                <Button
                  // disabled={Boolean(!mainStorekeeperStore.localApplication)}
                  type="primary"
                >
                  Добавить продукт
                </Button>
              </Dropdown>
            </div>
            <DataTable
              loading={byIdProductLoading}
              data={byIdProduct?.requestsProductList || []}
              columns={requestProductsColumn}
              isMobile={isMobile}
              loadingLength={1}
              pagination={false}
              scroll={{y: 600}}
            />
          </div>
        </Col>
      </Row>

      {mainStorekeeperStore.isOpneAddApplicationModal && (
        <ApplicationAddEditModal />
      )}
      {mainStorekeeperStore.isOpenAddProductApplicationModal && (
        <AddPorductApplicationModal
          warehouse={mainStorekeeperStore?.localApplication?.from}
        />
      )}
      {mainStorekeeperStore.isOpenEditReqProductModal && (
        <ApplicationProductEditModal />
      )}
    </>
  );
});
