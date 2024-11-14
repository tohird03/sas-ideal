import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Avatar, Card, DatePicker, DatePickerProps, InputNumber, Select, Skeleton, Typography} from 'antd';
import classNames from 'classnames/bind';
import {courierApi} from '@/api/courier';
import {requestApi} from '@/api/dmsRequest';
import {imgStages} from '@/api/endpoints';
import {locationApi} from '@/api/locations/locations';
import {requestStore} from '@/stores/dms';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';
import styles from '../create-flight.scss';
import {RequestInfoSkeleton} from './RequestInfo.Skeleton';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: {label: React.ReactElement, value: string, optionLabelProp: string}) =>
  (option?.optionLabelProp ?? '').toLowerCase().includes(input.toLowerCase());

const filterOptionLocation = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const RequestInfo = observer(() => {
  const {requestId} = useParams();
  const [searchCourier, setSearchCourier] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const {data: singleRequestData, isLoading: singleRequestLoading} = useQuery({
    queryKey: [
      'getSingleRequests',
      requestId,
    ],
    queryFn: () => requestId ? requestApi.getSingleRequest(requestId!) : null,
  });

  const {data: couriersData, isLoading: courierGetLoading} = useQuery({
    queryKey: [
      'getCouriers',
      searchCourier,
    ],
    queryFn: () => courierApi.getCouriers({
      pageNumber: 1,
      pageSize: 20,
      name: searchCourier!,
    }),
  });

  const {data: singleCourier} = useQuery({
    queryKey: [
      'getSingleCouriers',
      requestStore?.singleFlightCourier?.id,
    ],
    queryFn: () => requestStore?.singleFlightCourier?.id ? courierApi.getSingleCouriers(requestStore?.singleFlightCourier?.id) : null,
  });

  const {data: locationsData, isLoading: locationGetLoading} = useQuery({
    queryKey: [
      'getLocations',
      searchLocation,
    ],
    queryFn: () => locationApi.getLocations({
      pageNumber: 1,
      pageSize: 20,
      name: searchLocation!,
    }),
  });

  const handleCourierChange = (value: string) => {
    requestStore.setCreateFlightBody({
      ...requestStore.createFlightBody!,
      courierId: value!,
    });
  };

  const handleCourierSearch = (value: string) => {
    setSearchCourier(value);
  };

  const handleLocationChange = (value: string) => {
    requestStore.setCreateFlightBody({
      ...requestStore.createFlightBody!,
      to: value!,
    });
  };

  const handleLocationSearch = (value: string) => {
    setSearchLocation(value);
  };

  const handleDateChoose: DatePickerProps['onChange'] = (date) => {
    requestStore.setCreateFlightBody({
      ...requestStore.createFlightBody!,
      deliveryTime: date!,
    });
  };

  const handlePriceChange = (value: string | null) => {
    requestStore.setCreateFlightBody({
      ...requestStore.createFlightBody!,
      promotion: value!,
    });
  };

  const couriersOptions = useMemo(() => (
    [
      ...(singleCourier ? [singleCourier] : []),
      ...(couriersData?.courierList || []),
    ]?.map(courier => ({
      value: courier?.id,
      optionLabelProp: `${courier?.firstName} ${courier?.lastName}`,
      label: (
        <div className={cn('create-flight__info-applicant-user-wrapper')}>
          <Avatar src={`${imgStages?.apiUrl}${courier?.avatar}`} icon={<UserOutlined />} />
          <div>
            <Typography.Title
              level={5}
              className={cn('create-flight__info-username')}
            >
              {courier?.firstName}
              {courier?.lastName}
            </Typography.Title>
            <Typography.Paragraph
              className={cn('create-flight__info-phone')}
            >
                +{courier?.phone}
            </Typography.Paragraph>
          </div>
        </div>
      ),
    }))
  ), [couriersData, singleCourier]);

  const locationOptions = useMemo(() => (
    locationsData?.locationList?.map(location => ({
      value: location?.id,
      label: location?.name,
    }))
  ), [locationsData]);

  useEffect(() => {
    requestStore.setCreateFlightBody({
      ...requestStore.createFlightBody!,
      from: singleRequestData?.from?.id!,
    });
  }, [singleRequestData]);

  return (
    <div className={cn('create-flight__info-wrapper')}>
      <Card className={cn('create-flight__info-courier')}>
        {singleRequestLoading
          ? <RequestInfoSkeleton />
          : (
            <>
              <Typography.Title
                level={5}
                className={cn('create-flight__info-title')}
              >
        Заявка № {singleRequestData?.requestId}
              </Typography.Title>

              <div className={cn('create-flight__info-applicant')}>
                <Typography.Title
                  level={5}
                  className={cn('create-flight__info-title')}
                >
            Заявитель:
                </Typography.Title>
                <div className={cn('create-flight__info-applicant-user-wrapper')}>
                  <Avatar src={`${imgStages?.apiUrl}${singleRequestData?.requester?.avatar}`} icon={<UserOutlined />} />
                  <div>
                    <Typography.Title
                      level={5}
                      className={cn('create-flight__info-username')}
                    >
                      {singleRequestData?.requester?.firstName}
                      {singleRequestData?.requester?.lastName}
                    </Typography.Title>
                    <Typography.Paragraph
                      className={cn('create-flight__info-phone')}
                    >
                +{singleRequestData?.requester?.phone}
                    </Typography.Paragraph>
                  </div>
                </div>
              </div>
              <div className={cn('create-flight__info-applicant')}>
                <Typography.Title
                  level={5}
                  className={cn('create-flight__info-title')}
                >
            Получатель:
                </Typography.Title>
                <div className={cn('create-flight__info-applicant-user-wrapper')}>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Typography.Title
                      level={5}
                      className={cn('create-flight__info-username')}
                    >
                      {singleRequestData?.clientName}
                    </Typography.Title>
                    <Typography.Paragraph
                      className={cn('create-flight__info-phone')}
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
      <Card className={cn('create-flight__info-courier')}>
        <Typography.Title
          level={5}
          className={cn('create-flight__info-title')}
        >
            Рейс
        </Typography.Title>

        <div className={cn('create-flight__flight-row-wrapper create-flight__info-courierChoose')}>
          <Typography.Title
            level={5}
            className={cn('create-flight__info-title')}
          >
            Курьер:
          </Typography.Title>
          <Select
            style={{minWidth: '250px', height: '50px'}}
            options={couriersOptions}
            placeholder="Курьер"
            showSearch
            allowClear
            defaultValue={requestStore?.singleFlightCourier?.id}
            optionFilterProp="children"
            notFoundContent={courierGetLoading ? <Skeleton /> : null}
            onChange={handleCourierChange}
            onSearch={handleCourierSearch}
            filterOption={filterOption}
          />
        </div>
        <div className={cn('create-flight__flight-row-wrapper')}>
          <Typography.Title level={5}>
            От куда:
          </Typography.Title>
          <Typography.Title
            level={5}
          >
            {singleRequestData?.from?.name}
          </Typography.Title>
        </div>
        <div className={cn('create-flight__flight-row-wrapper')}>
          <Typography.Title level={5}>
            Куда:
          </Typography.Title>
          <Select
            placeholder="Куда:"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={locationGetLoading ? <Skeleton /> : null}
            options={locationOptions}
            onChange={handleLocationChange}
            onSearch={handleLocationSearch}
            filterOption={filterOptionLocation}
            loading={locationGetLoading}
            style={{minWidth: '250px'}}
          />
        </div>
        <div className={cn('create-flight__flight-row-wrapper')}>
          <Typography.Title level={5}>
            Когда:
          </Typography.Title>
          <DatePicker
            style={{minWidth: '250px'}}
            onChange={handleDateChoose}
            showTime
          />
        </div>
        <div className={cn('create-flight__flight-row-wrapper')}>
          <Typography.Title level={5}>
            Вознограждение:
          </Typography.Title>
          <InputNumber
            style={{minWidth: '250px'}}
            formatter={(value) => priceFormat(value!)}
            placeholder="Вознограждение"
            onChange={handlePriceChange}
          />
        </div>
      </Card>
    </div>
  );
});
