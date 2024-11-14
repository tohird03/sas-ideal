import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {ArrowRightOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {
  Button,
  Card,
  Collapse,
  ColorPicker,
  Empty,
  Image,
  Modal,
  Typography,
} from 'antd';
import classNames from 'classnames/bind';
import {courierFlightsApi} from '@/api/dmsRequest';
import {ICourierClosedFlightsDeliveries} from '@/api/dmsRequest/types';
import {imgStages} from '@/api/endpoints';
import {requestStore} from '@/stores/dms';
import {addNotification} from '@/utils';
import {getFullDateFormat, getTimeZoneDate} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import styles from './reward-info.scss';
import {RewardInfoSkeleton, RewardProductSkeleton} from './RewardInfo.Skeleton';

const cn = classNames.bind(styles);

export const RewardInfoModal = observer(() => {
  const [rewardInfoLoading, setRewardInfoLoading] = useState(false);
  const [flightAccardion, setFlightAccardion] = useState<ICourierClosedFlightsDeliveries[]>([]);
  const [singleClosedFlightId, setSingleClosedFlightId] = useState<string | null>(null);

  const {data: singleFlightProducts, isLoading: singleFlightProductsLoading} = useQuery({
    queryKey: [
      'getSingleFlightProducts',
      singleClosedFlightId,
    ],
    queryFn: () => singleClosedFlightId ? courierFlightsApi.getCourierSingleFlightInfoProducts(singleClosedFlightId) : null,
  });

  const handleClose = () => {
    requestStore.setSingleClosedFlight(null);
    requestStore.setIsOpenClosedFlightInfoModal(false);
  };

  const onChange = (key: string | string[]) => {
    setSingleClosedFlightId(key[0]);
  };

  useEffect(() => {
    if (requestStore.singleClosedFlight?.id) {
      setRewardInfoLoading(true);
      courierFlightsApi.getCourierClosedFlightsInfo({
        flightId: requestStore.singleClosedFlight?.id,
        startDate: requestStore.closedFlightStartDate,
        endDate: requestStore.closedFlightEndDate,
      })
        .then(res => {
          setFlightAccardion(res?.deliveries);
        })
        .catch(addNotification)
        .finally(() => {
          setRewardInfoLoading(false);
        });
    }
  }, [requestStore.singleClosedFlight?.id]);

  useEffect(() => {
    if (singleFlightProducts) {
      const updateFlightWithProducts = flightAccardion?.map(flight => {
        if (flight?.id === singleClosedFlightId) {
          return {
            ...flight,
            products: (flight?.products || [])?.concat(
              singleFlightProducts?.filter(
                singleFlightProduct => !flight?.products?.some(
                  flightProduct => flightProduct?.id === singleFlightProduct.id
                )
              )!
            ),
          };
        } else {
          return flight;
        }

      })?.filter(product => product);

      setFlightAccardion(updateFlightWithProducts);
    }

  }, [singleFlightProducts]);

  return (
    <Modal
      open={requestStore.isOpenClosedFlightInfoModal}
      onCancel={handleClose}
      onOk={handleClose}
      okText="Понятно"
      cancelText="Отмена"
      centered
      title={`Рейсы ${requestStore.singleClosedFlight?.courierInfo?.name} в ${getTimeZoneDate(requestStore.singleClosedFlight?.endDate!, -5)}`}
      width={600}
    >
      {rewardInfoLoading
        ? <RewardInfoSkeleton />
        : (
          <Collapse
            expandIconPosition="end"
            accordion
            items={flightAccardion?.map(flight => ({
              key: flight?.id,
              label: (
                <>
                  <div>
                    <div className={cn('reward-info__collapse-header')}>
                      <Typography.Title level={5} className={cn('reward-info__collapse-header-title')}>
                Рейс №{flight?.deliveryId}
                      </Typography.Title>
                      <Typography.Title level={5} className={cn('reward-info__collapse-header-title')}>
                  Вознограждение: {priceFormat(flight?.promotion!)} сум
                      </Typography.Title>
                    </div>
                    <Typography.Paragraph>
                От {flight?.from} до {flight?.to} {getFullDateFormat(flight?.deliveryTime)}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <div className={cn('reward-info__collapse-header')}>
                      <Typography.Title level={5} className={cn('reward-info__collapse-header-title')}>
                  Заявка №{flight?.request?.requestId}
                      </Typography.Title>
                    </div>
                    <Typography.Paragraph>
                От {flight?.request?.from} до {flight?.request?.to} {getFullDateFormat(flight?.request?.deliveryDate)}
                    </Typography.Paragraph>

                    <div className={cn('reward-info__collapse-header-request-wrapper')}>
                      <Typography.Title level={5}>
                  Заявитель:
                      </Typography.Title>
                      <div>
                        <Typography.Title level={5} className={cn('reward-info__collapse-header-title')}>
                          {flight?.request?.requesterName}
                        </Typography.Title>
                        <Typography.Paragraph>
                          {flight?.request?.requesterPhone}
                        </Typography.Paragraph>
                      </div>
                      <ArrowRightOutlined />
                      <Typography.Title level={5}>
                    Получатель:
                      </Typography.Title>
                      <div>
                        <Typography.Title level={5} className={cn('reward-info__collapse-header-title')}>
                          {flight?.request?.clientName}
                        </Typography.Title>
                        <Typography.Paragraph>
                          {flight?.request?.clientPhone}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                </>
              ),
              children: (
                singleFlightProductsLoading
                  ? <RewardProductSkeleton />
                  : (flight?.products?.length === 0
                    ? <Empty />
                    : flight?.products?.map(flightProduct => (
                      <>
                        <div className={cn('reward-info__product-card-wrapper')}>
                          <Card key={flightProduct?.id} className={cn('flight-info__product-card')}>
                            <div className={cn('reward-info__product-card-info')}>
                              <div className={cn('reward-info__product-card-product')}>
                                <Image
                                  width={80}
                                  height={50}
                                  src={`${imgStages?.apiUrl}${flightProduct?.images[0]}`}
                                  className={cn('reward-info__product-card-img')}
                                />
                                <div>
                                  <Typography.Paragraph className={cn('reward-info__product-card-desc')}>
                                    {flightProduct?.name}
                                  </Typography.Paragraph>
                                  <Typography.Paragraph className={cn('reward-info__product-card-desc')}>
                                    {flightProduct?.model?.name} - {flightProduct?.direction?.title}
                                  </Typography.Paragraph>
                                </div>
                              </div>
                              <div className={cn('reward-info__product-card-product')}>
                                <div>
                                  <Typography.Paragraph className={cn('reward-info__product-card-desc')}>
                                    {flightProduct?.tissue?.tissue?.name}
                                  </Typography.Paragraph>
                                  <Typography.Paragraph className={cn('reward-info__product-card-desc')}>
                                    {flightProduct?.tissue?.name}
                                  </Typography.Paragraph>
                                </div>
                                <ColorPicker disabled defaultValue={flightProduct?.tissue?.hexColor} />
                              </div>
                              <Button className={cn('reward-info__product-card-count')}>{flightProduct?.count}</Button>
                            </div>
                          </Card>
                        </div>
                      </>
                    ))
                  )
              ),
            }))}
            onChange={onChange}
          />
        )
      }


      <Typography.Title level={4}>Общий {priceFormat(requestStore?.singleClosedFlight?.promotion!)} сум</Typography.Title>
    </Modal>
  );
});
