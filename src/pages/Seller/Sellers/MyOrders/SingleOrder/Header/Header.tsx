import React, {ReactNode} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Typography} from 'antd';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ROUTES} from '@/constants';
import {EMyOrdersTabs, sellerMyOrdersStore} from '@/stores/seller/seller/orders/orders';
import {addNotification} from '@/utils';
import styles from '../single-order.scss';

const cn = classNames.bind(styles);

export const Header = observer(() => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {orderId} = useParams();

  const {mutate: deleteMyOrder} =
  useMutation({
    mutationKey: ['deleteMyOrder'],
    mutationFn: (orderId: string) => sellerSaleAndOrderApi.deleteMyOrder(orderId),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMySingleOrder']});
        addNotification('Удачно отменить этот заказ!');
        navigate(ROUTES.sellerMyOrders);
      }
    },
    onError: addNotification,
  });

  const handleCancelOrder = () => {
    deleteMyOrder(orderId!);
  };

  const handleAddPrePayments = () => {
    sellerMyOrdersStore.setIsOpenMySingleOrderPrePaymentsModal(true);
  };

  const CreateButtons: Record<EMyOrdersTabs, ReactNode> = {
    [EMyOrdersTabs.Payments]: (
      <Button
        onClick={handleAddPrePayments}
        icon={<PlusOutlined />}
        type="primary"
      >
        Добавить оплаты
      </Button>
    ),
    [EMyOrdersTabs.Client]: null,
    [EMyOrdersTabs.Products]: null,
  };

  return (
    <div className={cn('single-order__filter-wrapper')}>
      <div className={cn('single-order__filter-wrapper')}>
        <Typography.Title className={cn('single-order__filter-title')} level={3}>
         Сделка №{sellerMyOrdersStore?.mySingleOrderDatas?.orderId}
        </Typography.Title>
        <Popconfirm
          title="Отменить заказ"
          description="Вы уверены, этот заказ отменить?"
          onConfirm={handleCancelOrder}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button
            icon={<CloseOutlined />}
            type="primary"
            danger
          >
            Отменить сделку
          </Button>
        </Popconfirm>
      </div>
      <div className={cn('single-order__filter-wrapper')}>
        {CreateButtons[sellerMyOrdersStore.singleMyOrderActiveTab]}
      </div>
    </div>
  );
});
