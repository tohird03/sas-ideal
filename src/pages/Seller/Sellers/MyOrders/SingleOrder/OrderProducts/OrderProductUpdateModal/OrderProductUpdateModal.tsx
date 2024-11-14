import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Alert, Form, InputNumber, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import {ordersApi} from '@/api/orders';
import {EOrderDetailChangeType, IOrderDetailChangeParams} from '@/api/orders/types';
import {sellerStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const OrderProductUpdateModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [maxPriceWithSale, setMaxPriceWithSale] = useState(0);
  const [maxSellerSale, setMaxSellerSale] = useState(0);

  const {mutate: updateOrderProduct} =
  useMutation({
    mutationKey: ['updateOrderProduct'],
    mutationFn: (params: IOrderDetailChangeParams) => ordersApi.orderDetailChange(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getMySingleOrder']});
        addNotification('Успешное удаление продукта!');
        handleModalClose();
      }
    },
    onError: addNotification,
  });

  const handleSubmit = (value: IOrderDetailChangeParams) => {
    const trimmedObject = trimValues(value);

    updateOrderProduct({
      finalPrice: trimmedObject?.finalPrice,
      fixForSeller: trimmedObject?.fixForSeller,
      quantity: trimmedObject?.quantity,
      type: EOrderDetailChangeType?.Change,
      orderDetailId: sellerStore?.sellerSingleOrderDetailsProduct?.id!,
    });
  };

  const handleModalClose = () => {
    sellerStore.setSellerSingleOrderDetailsProduct(null);
    sellerStore.setIsOpenOrderDetailsProductUpdateModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleChangePriceWithSale = (value: number | null) => {
    if (sellerStore.sellerSingleOrderDetailsProduct) {
      const saleProduct = sellerStore.sellerSingleOrderDetailsProduct;
      const salePrice = saleProduct?.price - (value || 0);
      const allSale = (salePrice / saleProduct?.price) * 100;
      const sellerSale = allSale - saleProduct?.sale!;

      form.setFieldValue('fixForSeller', sellerSale);
    }
  };

  const handleChangeSellerSale = (value: number | null) => {
    if (sellerStore.sellerSingleOrderDetailsProduct) {
      const saleProduct = sellerStore.sellerSingleOrderDetailsProduct;
      const allSale = (value || 0) + sellerStore?.sellerSingleOrderDetailsProduct?.sale!;
      const thenSaleChangePriceWithSale = saleProduct?.price - ((saleProduct?.price * (allSale)) / 100);

      form.setFieldValue('finalPrice', thenSaleChangePriceWithSale);
    }
  };

  useEffect(() => {
    if (sellerStore.sellerSingleOrderDetailsProduct) {
      const saleProduct = sellerStore.sellerSingleOrderDetailsProduct;
      const allSale = saleProduct?.sale + saleProduct?.fixForSeller;
      const maxPriceWithSaleValue = saleProduct?.price - ((saleProduct?.price * saleProduct?.sale) / 100);
      const priceWithSale = saleProduct?.price - ((saleProduct?.price * allSale) / 100);
      const productMaxSellerSale = 100 - saleProduct?.sale;

      setMaxPriceWithSale(maxPriceWithSaleValue);
      setMaxSellerSale(productMaxSellerSale);
      form.setFieldValue('finalPrice', priceWithSale);
      form.setFieldValue('fixForSeller', saleProduct?.fixForSeller);
    }
  }, [sellerStore?.sellerSingleBasketModal]);

  return (
    <Modal
      open={sellerStore.isOpenOrderDetailsProductUpdateModal}
      title={'Обновить товар в корзине'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Alert
          message={`Цена: ${priceFormat(sellerStore?.sellerSingleOrderDetailsProduct?.price)} сум`}
          style={{marginBottom: '20px'}}
        />
        <Alert
          message={`Скидка: ${priceFormat(sellerStore?.sellerSingleOrderDetailsProduct?.sale)}`}
          style={{marginBottom: '20px'}}
        />
        <Form.Item
          name="finalPrice"
          label={`Цена со скидкой. Max: ${priceFormat(maxPriceWithSale)} сум`}
          rules={[
            {required: true},
            {
              message: `Max: ${priceFormat(maxPriceWithSale)} сум`,
              validator(rule, value) {
                if (value > maxPriceWithSale) {
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
            placeholder="Цена со скидкой"
            style={{width: '100%'}}
            formatter={(value) => priceFormat(value!)}
            onChange={handleChangePriceWithSale}
          />
        </Form.Item>
        <Form.Item
          name="fixForSeller"
          label={`Доп. скидка. Max: ${maxSellerSale}%`}
          rules={[
            {required: true},
            {
              message: `Max ${maxSellerSale}`,
              validator(rule, value) {
                if (value < 0 || value > (maxSellerSale)) {
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
            placeholder="Доп. скидка"
            style={{width: '100%'}}
            onChange={handleChangeSellerSale}
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label={`Количество. ${
            sellerStore?.sellerSingleOrderDetailsProduct?.fromWarehouse
              ? `Max: ${sellerStore?.sellerSingleOrderDetailsProduct?.product?.quantity}`
              : ''
          }`}
          rules={[
            {required: true},
            ...(sellerStore?.sellerSingleOrderDetailsProduct?.fromWarehouse
              ? [{
                message: `Максимальное количество ${sellerStore?.sellerSingleOrderDetailsProduct?.product?.quantity}`,
                validator(rule: any, value: number) {
                  if (value > sellerStore?.sellerSingleOrderDetailsProduct?.product?.quantity!) {
                    return Promise.reject();
                  } else {
                    return Promise.resolve();
                  }
                },
              }] : [])
            ,
          ]}
          validateTrigger="onChange"
          initialValue={sellerStore?.sellerSingleOrderDetailsProduct?.quantity}
        >
          <InputNumber
            placeholder="Количество"
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
