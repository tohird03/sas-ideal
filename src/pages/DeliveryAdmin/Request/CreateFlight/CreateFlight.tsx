import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation} from '@tanstack/react-query';
import {Button, notification} from 'antd';
import classNames from 'classnames/bind';
import {courierFlightsApi} from '@/api/dmsRequest';
import {ICreateFlightBody} from '@/api/dmsRequest/types';
import {ROUTES} from '@/constants';
import {requestStore} from '@/stores/dms';
import {addNotification} from '@/utils';
import styles from './create-flight.scss';
import {FlightProduct} from './FlightProduct';
import {ProductSplitModal} from './FlightProduct/ProductSplitModal';
import {RequestInfo} from './RequestInfo';

const cn = classNames.bind(styles);

export const CreateFlight = observer(() => {
  const {requestId} = useParams();
  const navigate = useNavigate();

  const {mutate: createFlight} =
    useMutation({
      mutationKey: ['createFlight'],
      mutationFn: (params: ICreateFlightBody) => courierFlightsApi.createFlight(params),
      onSuccess: () => {
        addNotification('Рейс успешно создан');
        navigate(ROUTES.dmsRequest);
      },
      onError: addNotification,
    });

  const handleCreateFlight = () => {
    const requestData: ICreateFlightBody = {
      ...requestStore.createFlightBody!,
      products: requestStore.createFlightProducts,
      status: 'delivered',
    };

    if (!requestData?.products?.length) {
      notification.error({
        message: 'Пожалуйста, выберите багаж, который нужно забрать',
      });

      return;
    }

    createFlight(requestData);

  };

  useEffect(() => {
    if (requestId) {
      requestStore.setCreateFlightBody({
        ...requestStore.createFlightBody!,
        requestId: requestId!,
      });
    } else {
      navigate(ROUTES.dmsRequest);
    }
  }, [requestId]);

  useEffect(() => () => {
    requestStore.setSingleFlightCourier(null);
  }, []);

  return (
    <>
      <div className={cn('create-flight')}>
        <RequestInfo />
        <FlightProduct />
      </div>
      <Button
        className={cn('create-flight__create-btn')}
        type="primary"
        onClick={handleCreateFlight}
      >
        Создавать
      </Button>

      {requestStore.isOpenProductSplitModal && <ProductSplitModal />}
    </>
  );
});
