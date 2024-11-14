import React from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {OrderWarehouseProductParams} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

export const OrderProductModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const handleCloseModal = () => {
    mainStorekeeperStore.setIsOpenIsOpenOrderProductModal(false);
    form.resetFields();
  };
  const handleModalOk = () => {
    form.submit();
  };

  const {
    mutate: orderWarehouseProductFunc,
    isPending: orderWarehouseProductFuncLoading,
  } = useMutation({
    mutationKey: ['orderWarehouseProduct'],
    mutationFn: (params: OrderWarehouseProductParams) =>
      mainStorekeeperStore.postOrderWarehouseProduct(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getMainStProduct']});
      addNotification('успешного заказа');
      handleCloseModal();
    },
    onError: addNotification,
  });

  const handleSubmit = (value: {quantity: string}) => {
    orderWarehouseProductFunc({
      productId: mainStorekeeperStore.warehouseOrderProduct?.id!,
      providerId: mainStorekeeperStore.warehouseOrderProduct?.provider?.id!,
      warehouseId: mainStorekeeperStore.warehouseOrderProduct?.warehouse?.id!,
      quantity: Number(value.quantity),
      date: new Date(),
    });
  };

  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
  };

  return (
    <>
      <Modal
        open={mainStorekeeperStore.isOpenOrderProductModal}
        onCancel={handleCloseModal}
        confirmLoading={orderWarehouseProductFuncLoading}
        onOk={handleModalOk}
        centered
        title={`Заказать ${mainStorekeeperStore.warehouseOrderProduct?.category?.title}`}
        width={400}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label={'Сколько'}
            name="quantity"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[
              {required: true},
              {
                validateTrigger: 'onChange',
                validator: (rule, value) =>
                  new Promise<void>((resolve, reject) => {
                    if (value) {
                      if (
                        Number(value) >
                        Number(
                          mainStorekeeperStore.warehouseOrderProduct?.quantity
                        )
                      ) {
                        reject('не должно быть больше количества товара!');
                      } else {
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  }),
              },
            ]}
          >
            <InputNumber
              min={'1'}
              style={{width: '100%'}}
              placeholder={`${mainStorekeeperStore.warehouseOrderProduct?.quantity} шт`}
              parser={parser}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
