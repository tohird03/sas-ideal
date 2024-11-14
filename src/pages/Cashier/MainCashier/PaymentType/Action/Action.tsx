import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {AxiosError} from 'axios';
import {paymentTypeApi} from '@/api/paymentType';
import {IPaymentType} from '@/api/paymentType/types';
import {paymentTypeStore} from '@/stores/cashier';
import {addNotification} from '@/utils';

type Props = {
  paymentType: IPaymentType;
};

export const Action: FC<Props> = observer(({paymentType}) => {
  const queryClient = useQueryClient();

  const {mutate: deletePaymentType} =
  useMutation({
    mutationKey: ['deletePaymentType'],
    mutationFn: (id: string) => paymentTypeApi.deletePaymentType(id!),
    onSuccess: () => {
      addNotification('Успешное удаление типа платежа');
      queryClient.invalidateQueries({queryKey: ['getPaymentType']});
    },
    onError: (error: AxiosError) => {
      addNotification(error);
    },
  });

  const handleEditPaymentType = () => {
    paymentTypeStore.setSinglePaymentType(paymentType);
    paymentTypeStore.setIsOpenAddEditPaymentTypeModal(true);
  };

  const handleDelete = () => {
    deletePaymentType(paymentType?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditPaymentType} type="primary" icon={<EditOutlined />} />
      <Popconfirm
        title="Удалить вид оплаты"
        description="Вы уверены, что хотите удалить этого вид оплаты?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
  );
});
