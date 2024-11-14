import React from 'react';
import {observer} from 'mobx-react';
import {ArrowRightOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {EOrderDetailChangeType, IUpdateOrderDetailChange, IUpdateOrderDetailChangeStatus} from '@/api/orders/types';
import {DataTable} from '@/components/Datatable/datatable';
import {changesStore} from '@/stores/centralOperator';
import {addNotification} from '@/utils';
import styles from '../changes.scss';
import {changeProductInfoColumnsForChangeRequest, changeProductInfoRequestColumns} from '../constants';

const cn = classNames.bind(styles);

export const ChangeProductInfoRequestModal = observer(() => {
  const queryClient = useQueryClient();

  const {mutate: changeProduct, isPending: changeLoading} =
  useMutation({
    mutationKey: ['changeProduct'],
    mutationFn: (params: IUpdateOrderDetailChange) => ordersApi.updateOrderDetailChange(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getOrderDetailsChange']});
        addNotification('Успешное обновление');
        handleCloseModal();
      }
    },
    onError: addNotification,
  });

  const {data: getSingleOrderDetailsChange, isLoading: loading} =
    useQuery({
      queryKey: [
        'getSingleOrderDetailsChange',
        changesStore?.singleOrderDetailsChange?.id,
      ],
      queryFn: () => ordersApi.getSingleOrderDetailChange(changesStore?.singleOrderDetailsChange?.id!),
      enabled: !!changesStore?.singleOrderDetailsChange?.id,
    });

  const handleCloseModal = () => {
    changesStore.setIsOpenChangeProductInfoRequestModal(false);
  };

  const handleRejectRequest = () => {
    changeProduct({
      orderDetailId: getSingleOrderDetailsChange?.id!,
      status: IUpdateOrderDetailChangeStatus.Rejected,
      type: EOrderDetailChangeType.Change,
    });
  };

  const handleApproveChanges = () => {
    changeProduct({
      orderDetailId: getSingleOrderDetailsChange?.id!,
      status: IUpdateOrderDetailChangeStatus.Accepted,
      type: EOrderDetailChangeType.Change,
    });
  };

  return (
    <Modal
      open={changesStore?.isOpenChangeProductInfoRequestModal}
      onCancel={handleCloseModal}
      title="Изменение"
      centered
      footer={null}
      width={800}
    >
      <div className={cn('changes__change-product-request-wrapper')}>
        <div className={cn('changes__change-product-request')}>
          <DataTable
            loading={loading}
            loadingLength={1}
            data={[getSingleOrderDetailsChange || []]}
            columns={changeProductInfoColumnsForChangeRequest('old')}
            isMobile
            pagination={false}
          />
          <Button
            loading={changeLoading}
            onClick={handleRejectRequest}
            className={cn('changes__change-reject-button')}
            type="primary"
            danger
          >
            Оставить старую
          </Button>
        </div>
        <ArrowRightOutlined
          style={{fontSize: '40px', color: 'green'}}
        />
        <div className={cn('changes__change-product-request')}>
          <DataTable
            loading={loading}
            loadingLength={1}
            data={[getSingleOrderDetailsChange || []]}
            columns={changeProductInfoColumnsForChangeRequest('new')}
            isMobile
            pagination={false}
            className={cn('changes__change-product-table')}
          />
          <Button
            loading={changeLoading}
            onClick={handleApproveChanges}
            type="primary"
          >
            Принять изменения
          </Button>
        </div>
      </div>
    </Modal>
  );
});
