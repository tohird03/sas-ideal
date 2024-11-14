import React from 'react';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Avatar, Button, Card, ColorPicker, Image, Modal, Typography} from 'antd';
import classNames from 'classnames/bind';
import {courierFlightsApi} from '@/api/dmsRequest';
import {imgStages} from '@/api/endpoints';
import {requestStore} from '@/stores/dms';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import styles from './flight-info.scss';
import {FlightInfoProductSkeleton, FlightInfoSkeleton} from './FlightInfo.Skeleton';

const cn = classNames.bind(styles);

export const FlightInfoModal = observer(() => {

  const handleModalClose = () => {
    requestStore.setFlightId(null);
    requestStore.setSingleFlightCourier(null);
    requestStore.setIsOpenFlightInfoModal(false);
  };

  const {data: courierSingleFlight, isLoading: singleFlightLoading} = useQuery({
    queryKey: [
      'getCourierSingleFlight',
      requestStore.flightId,
    ],
    queryFn: () => requestStore?.flightId ? courierFlightsApi.getCourierSingleFlightInfo(requestStore?.flightId!) : null,
  });

  const {data: singleFlightProducts, isLoading: singleFlightProductsLoading} = useQuery({
    queryKey: [
      'getSingleFlightProducts',
      requestStore?.flightId,
    ],
    queryFn: () => requestStore?.flightId ? courierFlightsApi.getCourierSingleFlightInfoProducts(requestStore.flightId) : null,
  });

  return (
    <Modal
      open={requestStore.isOpenFlightInfoModal}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
      title="Разделить продукт"
      width={1200}
    >
      <div className={cn('flight-info')}>
        <div className={cn('flight-info__info-wrapper')}>
          <Card className={cn('flight-info__info-courier')}>
            {singleFlightLoading
              ? <FlightInfoSkeleton />
              : (
                <>
                  <Typography.Title
                    level={4}
                    className={cn('flight-info__info-title')}
                  >
                    Рейс №{courierSingleFlight?.deliveryId}
                  </Typography.Title>

                  <div className={cn('flight-info__info-applicant')}>
                    <Typography.Title
                      level={5}
                      className={cn('flight-info__info-title')}
                    >
                      Курьер:
                    </Typography.Title>
                    <div className={cn('flight-info__info-applicant-user-wrapper')}>
                      <Avatar src={`${imgStages?.apiUrl}${requestStore?.singleFlightCourier?.avatar}`} icon={<UserOutlined />} />
                      <div>
                        <Typography.Title
                          level={5}
                          className={cn('flight-info__info-username')}
                        >
                          {requestStore?.singleFlightCourier?.firstName}
                          {requestStore?.singleFlightCourier?.lastName}
                        </Typography.Title>
                        <Typography.Paragraph
                          className={cn('flight-info__info-phone')}
                        >
                    +{requestStore?.singleFlightCourier?.phone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                  <Typography.Title
                    level={5}
                  >
                    От куда: {courierSingleFlight?.from?.name}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Куда: {courierSingleFlight?.to?.name}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Когда: {getFullDateFormat(courierSingleFlight?.deliveryTime!)}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Вознограждение: {priceFormat(courierSingleFlight?.promotion!)} сум
                  </Typography.Title>
                </>
              )
            }
          </Card>
          <Card className={cn('flight-info__info-courier')}>
            {singleFlightLoading
              ? <FlightInfoSkeleton />
              : (
                <>
                  <Typography.Title
                    level={4}
                    className={cn('flight-info__info-title')}
                  >
                    Заявка № {courierSingleFlight?.request?.requestId}
                  </Typography.Title>

                  <div className={cn('flight-info__info-applicant')}>
                    <Typography.Title
                      level={5}
                      className={cn('flight-info__info-title')}
                    >
                    Заявитель:
                    </Typography.Title>
                    <div className={cn('flight-info__info-applicant-user-wrapper')}>
                      <Avatar src={`${imgStages?.apiUrl}${courierSingleFlight?.request?.requester?.avatar}`} icon={<UserOutlined />} />
                      <div>
                        <Typography.Title
                          level={5}
                          className={cn('flight-info__info-username')}
                        >
                          {courierSingleFlight?.request?.requester?.firstName}
                          {courierSingleFlight?.request?.requester?.lastName}
                        </Typography.Title>
                        <Typography.Paragraph
                          className={cn('flight-info__info-phone')}
                        >
                          +{courierSingleFlight?.request?.requester?.phone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                  <div className={cn('flight-info__info-applicant')}>
                    <Typography.Title
                      level={5}
                      className={cn('flight-info__info-title')}
                    >
                    Получатель:
                    </Typography.Title>
                    <div className={cn('flight-info__info-applicant-user-wrapper')}>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Typography.Title
                          level={5}
                          className={cn('flight-info__info-username')}
                        >
                          {courierSingleFlight?.request?.clientName}
                        </Typography.Title>
                        <Typography.Paragraph
                          className={cn('flight-info__info-phone')}
                        >
                          +{courierSingleFlight?.request?.clientPhone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                  <Typography.Title
                    level={5}
                  >
                      От куда: {courierSingleFlight?.request?.from?.name}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Куда: {courierSingleFlight?.request?.to}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                  >
                    Когда: {getFullDateFormat(courierSingleFlight?.request?.deliveryDate!)}
                  </Typography.Title>
                </>
              )
            }
          </Card>
        </div>
        <div className={cn('flight-info__product-wrapper')}>
          <Card className={cn('flight-info__product')}>
            <div className={cn('flight-info__product-header')}>
              <Typography.Title
                level={4}
              >
                Продукты
              </Typography.Title>
              <Typography.Title
                level={4}
                className={cn('flight-info__product-count')}
              >
                {singleFlightProducts?.length}
              </Typography.Title>
            </div>

            <div className={cn('flight-info__product-card-wrapper')}>
              {singleFlightProductsLoading
                ? <FlightInfoProductSkeleton />
                : (
                  singleFlightProducts?.map(product => (
                    <Card key={product?.id} className={cn('flight-info__product-card')}>
                      <div className={cn('flight-info__product-card-info')}>
                        <div className={cn('flight-info__product-card-product')}>
                          <Image
                            width={80}
                            height={50}
                            src={`${imgStages?.apiUrl}${product?.images[0]}`}
                            className={cn('flight-info__product-card-img')}
                          />
                          <div>
                            <Typography.Paragraph className={cn('flight-info__product-card-desc')}>
                              {product?.name}
                            </Typography.Paragraph>
                            <Typography.Paragraph className={cn('flight-info__product-card-desc')}>
                              {product?.model?.name} - {product?.direction?.title}
                            </Typography.Paragraph>
                          </div>
                        </div>
                        <div className={cn('flight-info__product-card-product')}>
                          <div>
                            <Typography.Paragraph className={cn('flight-info__product-card-desc')}>
                              {product?.tissue?.tissue?.name}
                            </Typography.Paragraph>
                            <Typography.Paragraph className={cn('flight-info__product-card-desc')}>
                              {product?.tissue?.name}
                            </Typography.Paragraph>
                          </div>
                          <ColorPicker disabled defaultValue={product?.tissue?.hexColor} />
                        </div>
                        <Button className={cn('flight-info__product-card-count')}>{product?.count}</Button>
                      </div>
                    </Card>
                  ))
                )
              }

            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
});
