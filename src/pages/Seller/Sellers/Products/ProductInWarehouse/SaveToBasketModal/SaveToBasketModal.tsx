import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISellerAddProductToBasketParams} from '@/api/seller/sellerSaleAndOrder/types';
import {sellerProductStore} from '@/stores/seller';
import {addNotification} from '@/utils';

export const SaveToBasketModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {mutate: addToBasket, isPending: loading} =
  useMutation({
    mutationKey: ['addToBasket'],
    mutationFn: (params: ISellerAddProductToBasketParams) => sellerSaleAndOrderApi.addProductToBasket(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMainStProduct']});
        addNotification('Успешное добавление товара в корзину');
        handleModalClose();
      }
    },
    onError: addNotification,
  });

  const handleFinishAdd = () => {
    form.submit();
  };

  const handleModalClose = () => {
    sellerProductStore.setSingleWarehouseProducts(null);
    sellerProductStore.setIsOpenSaveToBasketWarehouseProductModal(false);
  };

  const handleChangeStatus = (value: ISellerAddProductToBasketParams) => {
    addToBasket({
      quantity: value?.quantity,
      wmsProductId: sellerProductStore?.singleWarehouseProducts?.id!,
      partId: sellerProductStore?.singleWarehouseProducts?.partId!,
      fromWarehouse: true,
      productId: sellerProductStore?.singleWarehouseProducts?.wmsProductId!,
    });
  };

  useEffect(() => {
    form.setFieldValue('quantity', sellerProductStore?.singleWarehouseProducts?.quantity);
  }, [sellerProductStore?.singleWarehouseProducts?.quantity]);

  return (
    <Modal
      open={sellerProductStore?.isOpenSaveToBasketWarehouseProductModal}
      onOk={handleFinishAdd}
      onCancel={handleModalClose}
      title="В корзинку 89922"
      confirmLoading={loading}
      width={400}
      centered
    >
      <Form
        layout="vertical"
        onFinish={handleChangeStatus}
        form={form}
      >
        <Form.Item
          label={`Забрать из ${sellerProductStore?.singleWarehouseProducts?.quantity}`}
          name="quantity"
          rules={[
            {required: true},
            {
              message: `Номер продукта должен быть меньше ${sellerProductStore?.singleWarehouseProducts?.quantity}`,
              validator(rule, value) {
                if (value > sellerProductStore?.singleWarehouseProducts?.quantity!) {
                  return Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
          validateTrigger="onChange"
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder={`Забрать из ${sellerProductStore?.singleWarehouseProducts?.quantity}`}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
