import React from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Avatar, Button, Card, ColorPicker, Image, Modal, Pagination, PaginationProps, Typography} from 'antd';
import classNames from 'classnames/bind';
import {requestApi} from '@/api/dmsRequest';
import {imgStages} from '@/api/endpoints';
import {ROUTES} from '@/constants';
import {requestStore} from '@/stores/dms';
import {getFullDateFormat} from '@/utils/getDateFormat';
import styles from './request-info.scss';
import {RequestInfoProductSkeleton, RequestInfoSkeleton} from './RequestInfo.Skeleton';

const cn = classNames.bind(styles);

export const RequestInfoModal = observer(() => {
  const navigate = useNavigate();

  const {data: singleRequestData, isLoading: singleRequestLoading} = useQuery({
    queryKey: [
      'getSingleRequests',
      requestStore?.requestId,
    ],
    queryFn: () => requestStore?.requestId ? requestApi.getSingleRequest(requestStore?.requestId!) : null,
  });

  const {data: singleRequestProducts, isLoading: singleRequestProductsLoading} = useQuery({
    queryKey: [
      'getSingleRequestProducts',
      requestStore?.requestId,
      requestStore.requestProductPageNumber,
      requestStore.requestProductPageSize,
    ],
    queryFn: () => requestStore?.requestId ? requestApi.getRequestProducts({
      requestId: requestStore?.requestId,
      pageNumber: requestStore.requestProductPageNumber,
      pageSize: requestStore.requestProductPageSize,
    }) : null,
  });

  const handleModalClose = () => {
    requestStore.setRequestId(null);
    requestStore.setIsOpenRequestInfoModal(false);
  };

  const handleCreateFlight = () => {
    handleModalClose();
    navigate(ROUTES.dmsCreateFlight?.replace(':requestId', singleRequestData?.id!));
  };

  const handleRequestProductPaginationChange: PaginationProps['onChange'] = (pageNumber, pageSize: number) => {
    requestStore.setRequestProductPageNumber(pageNumber);
    requestStore.setRequestPageSize(pageSize);
  };

  return (
    <Modal
      open={requestStore.isOpenRequestInfoModal}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
      title={`Заявка №${singleRequestData?.requestId || 0}`}
      width={1200}
    >
      <div className={cn('request-info')}>
        <div className={cn('request-info__info-wrapper')}>
          <Card className={cn('request-info__info-courier')}>
            {singleRequestLoading
              ? <RequestInfoSkeleton />
              : (
                <>
                  <Typography.Title
                    level={4}
                    className={cn('request-info__info-title')}
                  >
                      Заявка № {singleRequestData?.requestId}
                  </Typography.Title>

                  <div className={cn('request-info__info-applicant')}>
                    <Typography.Title
                      level={5}
                      className={cn('request-info__info-title')}
                    >
                      Заявитель:
                    </Typography.Title>
                    <div className={cn('request-info__info-applicant-user-wrapper')}>
                      <Avatar src={`${imgStages?.apiUrl}${singleRequestData?.requester?.avatar}`} icon={<UserOutlined />} />
                      <div>
                        <Typography.Title
                          level={5}
                          className={cn('request-info__info-username')}
                        >
                          {singleRequestData?.requester?.firstName}
                          {singleRequestData?.requester?.lastName}
                        </Typography.Title>
                        <Typography.Paragraph
                          className={cn('request-info__info-phone')}
                        >
                          +{singleRequestData?.requester?.phone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                  <div className={cn('request-info__info-applicant')}>
                    <Typography.Title
                      level={5}
                      className={cn('request-info__info-title')}
                    >
                      Получатель:
                    </Typography.Title>
                    <div className={cn('request-info__info-applicant-user-wrapper')}>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Typography.Title
                          level={5}
                          className={cn('request-info__info-username')}
                        >
                          {singleRequestData?.clientName}
                        </Typography.Title>
                        <Typography.Paragraph
                          className={cn('request-info__info-phone')}
                        >
                          +{singleRequestData?.clientPhone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                  <Typography.Title
                    level={5}
                  >
                    От куда: {singleRequestData?.from?.name}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Куда: {singleRequestData?.to}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Когда: {getFullDateFormat(singleRequestData?.deliveryDate!)}
                  </Typography.Title>
                </>
              )

            }

          </Card>
          <Button
            type="primary"
            onClick={handleCreateFlight}
            disabled={!singleRequestData}
          >
            Создать рейс
          </Button>
        </div>
        <div className={cn('request-info__product-wrapper')}>
          <Card className={cn('request-info__product')}>
            <div className={cn('request-info__product-header')}>
              <Typography.Title
                level={4}
              >
                Продукты
              </Typography.Title>
              <Typography.Title
                level={4}
                className={cn('request-info__product-count')}
              >
                {singleRequestProducts?.count}
              </Typography.Title>
            </div>

            <div className={cn('request-info__product-card-wrapper')}>
              {singleRequestProductsLoading
                ? <RequestInfoProductSkeleton />
                : singleRequestProducts?.requestsProductList?.map(product => (
                  <Card key={product?.id} className={cn('request-info__product-card')}>
                    <div className={cn('request-info__product-card-info')}>
                      <div className={cn('request-info__product-card-product')}>
                        <Image
                          width={80}
                          height={50}
                          src={`${imgStages?.apiUrl}${product?.images[0]}`}
                          className={cn('request-info__product-card-img')}
                        />
                        <div>
                          <Typography.Paragraph className={cn('request-info__product-card-desc')}>
                            {product?.name}
                          </Typography.Paragraph>
                          <Typography.Paragraph className={cn('request-info__product-card-desc')}>
                            {product?.model?.name} - {product?.direction?.title}
                          </Typography.Paragraph>
                        </div>
                      </div>
                      <div className={cn('request-info__product-card-product')}>
                        <div>
                          <Typography.Paragraph className={cn('request-info__product-card-desc')}>
                            {product?.tissue?.tissue?.name}
                          </Typography.Paragraph>
                          <Typography.Paragraph className={cn('request-info__product-card-desc')}>
                            {product?.tissue?.name}
                          </Typography.Paragraph>
                        </div>
                        <ColorPicker disabled defaultValue={product?.tissue?.hexColor} />
                      </div>
                      <Button className={cn('request-info__product-card-count')}>{product?.count}</Button>
                    </div>
                  </Card>
                ))
              }

            </div>
            <Pagination
              className={cn('request-info__pagination')}
              onChange={handleRequestProductPaginationChange}
              total={singleRequestProducts?.count || 0}
              showTotal={(total) => `Общее количество: ${total}`}
              current={requestStore.requestProductPageNumber}
              pageSize={requestStore.requestProductPageSize}
              showSizeChanger
            />
          </Card>
        </div>
      </div>
    </Modal>
  );
});
