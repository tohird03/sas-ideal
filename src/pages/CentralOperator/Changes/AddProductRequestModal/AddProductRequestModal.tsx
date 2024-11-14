import React from 'react';
import {observer} from 'mobx-react';
import {ArrowRightOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {ordersApi} from '@/api/orders';
import {EOrderDetailChangeType, IUpdateOrderDetailChange, IUpdateOrderDetailChangeStatus} from '@/api/orders/types';
import {DataTable} from '@/components/Datatable/datatable';
import {changesStore} from '@/stores/centralOperator';
import {addNotification} from '@/utils';
import styles from '../changes.scss';
import {changeProductInfoRequestColumns} from '../constants';

const cn = classNames.bind(styles);

export const AddProductRequestModal = observer(() => {
  const queryClient = useQueryClient();

  const {mutate: deleteOrderChangeDetail, isPending: loading} =
  useMutation({
    mutationKey: ['deleteOrderChangeDetail'],
    mutationFn: (params: IUpdateOrderDetailChange) => ordersApi.updateOrderDetailChange(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getOrderDetailsChange']});
        addNotification('Успешное удаление');
        handleCloseModal();
      }
    },
    onError: addNotification,
  });

  const handleCloseModal = () => {
    changesStore.setSingleOrderDetailsChange(null);
    changesStore.setIsOpenAddProductRequestModal(false);
  };

  const handleRejectRequest = () => {
    handleCloseModal();
  };

  const handleDeleteProduct = () => {
    deleteOrderChangeDetail({
      orderDetailId: changesStore?.singleOrderDetailsChange?.id!,
      status: IUpdateOrderDetailChangeStatus.Accepted,
      type: EOrderDetailChangeType.Cancel,
    });
  };

  return (
    <Modal
      open={changesStore?.isOpenAddProductRequestModal}
      onCancel={handleCloseModal}
      title="Изменение"
      centered
      footer={null}
      width={400}
    >
      <div className={cn('changes__add-product-request-wrapper')}>
        <DataTable
          // loading={applicationsDataLoading}
          data={[changesStore?.singleOrderDetailsChange]}
          columns={changeProductInfoRequestColumns}
          isMobile
          pagination={false}
          cardStyle={{backgroundColor: '#ff3333'}}
          cardTextStyle={{color: 'white'}}
        />
        <div className={cn('changes__add-product-buttons-wrapper')}>
          <Button
            onClick={handleRejectRequest}
            type="primary"
          >
            Закрывать
          </Button>
          <Button
            onClick={handleDeleteProduct}
            type="primary"
            style={{background: 'red'}}
            loading={loading}
          >
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
});
