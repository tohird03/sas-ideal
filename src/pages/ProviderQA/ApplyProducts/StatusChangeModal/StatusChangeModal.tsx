import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Modal, Select} from 'antd';
import {IProductStatus} from '@/api/types';
import {warehouseOrdersApi} from '@/api/wmsOrders';
import {IProviderProductStatusChange} from '@/api/wmsOrders/types';
import {applyProductsQaStore} from '@/stores/providerQA';
import {addNotification} from '@/utils';
import {ChangeStatusOption} from '../constants';

export const ProductStatusChangeModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const optionsForStatus = ChangeStatusOption[applyProductsQaStore?.singleProduct?.status as keyof typeof ChangeStatusOption];

  const {mutate: providerProductStatusChange} =
  useMutation({
    mutationKey: ['providerProductStatusChange'],
    mutationFn: (params: IProviderProductStatusChange) => warehouseOrdersApi.providerProductStatusChange(params!),
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries({queryKey: ['getProviderOrders']});
      handleModalClose();
    },
    onError: addNotification,
  });

  const handleFinishAdd = () => {
    form.submit();
  };

  const handleModalClose = () => {
    applyProductsQaStore.setSingleProduct(null);
    applyProductsQaStore.setIsOpenProductStatusChangeModal(false);
  };

  const handleChangeStatus = (value: {status: IProductStatus}) => {
    setLoading(true);
    providerProductStatusChange({
      status: value?.status!,
      productId: applyProductsQaStore?.singleProduct?.id!,
    });
  };

  return (
    <Modal
      open={applyProductsQaStore?.isOpenProductStatusChangeModal}
      onCancel={handleModalClose}
      onOk={handleFinishAdd}
      title="Изменить статус"
      centered
      confirmLoading={loading}
    >
      <Form
        layout="vertical"
        onFinish={handleChangeStatus}
        form={form}
      >
        <Form.Item
          label="Select a status"
          name="status"
          rules={[{required: true, message: 'Please select a status'}]}
        >
          <Select
            options={optionsForStatus?.map((option) => ({
              value: option?.value,
              label: option?.label,
            }))}
            placeholder="Select a status"
            className="w-full p-10 m-3"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
