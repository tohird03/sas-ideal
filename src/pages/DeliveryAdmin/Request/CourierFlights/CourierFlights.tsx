import React from 'react';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Avatar, Button, Card, Collapse, Pagination, PaginationProps, Tag, Typography} from 'antd';
import classNames from 'classnames/bind';
import {CourierTgStatus} from '@/api/courier/types';
import {courierFlightsApi} from '@/api/dmsRequest';
import {ICourierFlights} from '@/api/dmsRequest/types';
import {imgStages} from '@/api/endpoints';
import {requestStore} from '@/stores/dms';
import {getTimeZoneDate} from '@/utils/getDateFormat';
import styles from '../request.scss';
import {RequestSkeleton} from '../Request.Skeleton';

const cn = classNames.bind(styles);

export const CourierFlights = observer(() => {

  const {data: courierFlightData, isLoading: flightsLoading} = useQuery({
    queryKey: [
      'getCourierFlights',
      requestStore.courierFlightPageNumber,
      requestStore.courierFlightPageSize,
      requestStore.requestAndFlightClientSearch,
      requestStore.requestAndFlightRequestIdSearch,
      requestStore.requestAndFlightProductIdSearch,
      requestStore.requestAndFlightRequestrSearch,
    ],
    queryFn: () => courierFlightsApi.getCouriersFlights({
      pageNumber: requestStore.courierFlightPageNumber,
      pageSize: requestStore.courierFlightPageSize,
      client: requestStore.requestAndFlightClientSearch!,
      requestId: requestStore.requestAndFlightRequestIdSearch!,
      productId: requestStore.requestAndFlightProductIdSearch!,
      flag: requestStore.requestAndFlightRequestrSearch!,
    }),
  });

  const handleCourierFlightsPaginationChange: PaginationProps['onChange'] = (pageNumber, pageSize: number) => {
    requestStore.setCourierFlightPageNumber(pageNumber);
    requestStore.setCourierFlightPageSize(pageSize);
  };

  const handleFlightInfoOpenModal = (flightId: string, delivery: ICourierFlights) => {
    requestStore.setFlightId(flightId);
    requestStore.setSingleFlightCourier(delivery);
    requestStore.setIsOpenFlightInfoModal(true);
  };

  const handleOpenAddFlightRequestModal = (delivery: ICourierFlights) => {
    requestStore.setSingleFlightCourier(delivery);
    requestStore.setIsOpenAddFlightRequestModal(true);
  };

  return (
    <>
      {flightsLoading
        ? <RequestSkeleton />
        : (
          <>
            <Collapse
              className={cn('request__collapse-accardion')}
              accordion
              items={courierFlightData?.deliveryList?.map(delivery => ({
                key: delivery?.id,
                label: (
                  <>
                    <div className={cn('request__collapse-header-wrapper')}>
                      <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        className={cn('request__collapse-avatar')}
                        src={`${imgStages.apiUrl}${delivery?.avatar}`}
                      />
                      {delivery?.deliveries?.length > 0 && (
                        <>
                          <div className={cn('request__collapse-flight-info')}>
                            <div className={cn('request__collapse-header-desc')}>
                              <h3 className={cn('request__collapse-fullName')}>
                                {delivery?.firstName} {delivery?.lastName}
                              </h3>
                              <Tag
                                color="gold"
                                className={cn('request__collapse-header-status')}
                              >
                                {delivery?.deliveries[0]?.status}
                              </Tag>
                            </div>
                            <p className={cn('request__collapse-header-desc')}>
                              <span
                                className={cn('request__collapse-header-desc-time')}
                              >
                          Сейчас
                              </span>
                          От {delivery?.deliveries[0]?.from?.name} до {delivery?.deliveries[0]?.to?.name}
                              <span
                                className={cn('request__collapse-header-desc-hour')}
                              >
                                {getTimeZoneDate(delivery?.deliveries[0]?.deliveryTime, -5)}
                              </span>
                            </p>
                            <p className={cn('request__collapse-header-desc')}>
                              <span
                                className={cn('request__collapse-header-desc-time')}
                              >
                          Последний
                              </span>
                        От {delivery?.deliveries?.reverse()[0]?.from?.name} до {delivery?.deliveries?.reverse()[0]?.to?.name}
                              <span
                                className={cn('request__collapse-header-desc-hour')}
                              >
                                {getTimeZoneDate(delivery?.deliveries?.reverse()[0]?.deliveryTime, -5)}
                              </span>
                            </p>
                          </div>
                        </>
                      )
                      }

                    </div>
                    <p className={cn('request__collapse-header-request-count')}>
                    Рейсы: {delivery?.deliveries?.length}шт
                    </p>
                  </>
                ),
                children: (
                  <>
                    {
                      delivery?.deliveries?.map(flight => (
                        <Card key={flight?.id}>
                          <div className={cn('request__collapse-body-card')}>
                            <div>
                              <Typography.Text className={cn('request__collapse-body-desc')} strong>От: {flight?.from?.name}</Typography.Text>
                              <Typography.Text className={cn('request__collapse-body-desc')} strong>До: {flight?.to?.name}</Typography.Text>
                              <Typography.Text className={cn('request__collapse-body-desc')} strong>
                                        В: {getTimeZoneDate(flight?.deliveryTime, -5)}
                              </Typography.Text>
                            </div>
                            <Button
                              type="primary"
                              onClick={handleFlightInfoOpenModal.bind(null, flight?.id, delivery)}
                            >
                                  Продукты
                            </Button>
                          </div>
                        </Card>
                      ))
                    }

                    <Button
                      type="primary"
                      onClick={handleOpenAddFlightRequestModal.bind(null, delivery)}
                      disabled={delivery?.tgStatus === CourierTgStatus.Active}
                      className={cn('request__collapse-body-flight-addBtn')}
                    >
                        Создать рейс
                    </Button>
                  </>
                ),
              }))}
              expandIconPosition="end"
            />
            <Pagination
              className={cn('request-info__pagination')}
              onChange={handleCourierFlightsPaginationChange}
              total={courierFlightData?.count || 0}
              showTotal={(total) => `Общее количество: ${total}`}
              current={requestStore.requestProductPageNumber}
              pageSize={requestStore.requestProductPageSize}
              showSizeChanger
            />
          </>
        )
      }
    </>
  );
});
