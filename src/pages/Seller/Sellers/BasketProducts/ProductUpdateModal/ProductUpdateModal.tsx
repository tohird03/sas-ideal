import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Alert, Form, Input, InputNumber, Modal, Select} from 'antd';
import {OldPriceFactor} from '@/api/product_list/types';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {IUpdateBasketProduct} from '@/api/seller/sellerSaleAndOrder/types';
import {processStore} from '@/stores/process';
import {sellerStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const ProductUpdateModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [oldPriceFactor, setOldPriceFactor] = useState<OldPriceFactor | null>(null);
  const [maxPriceWithSale, setMaxPriceWithSale] = useState(0);
  const [maxSellerSale, setMaxSellerSale] = useState(0);

  const {mutate: updateBasketProduct, isPending: updateProductLoading} =
    useMutation({
      mutationKey: ['updateBasketProduct'],
      mutationFn: (params: IUpdateBasketProduct) => sellerSaleAndOrderApi.updateBasketProduct(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getBasketProducts']});
        handleModalClose();
      },
      onError: addNotification,
    });

  const handleSubmit = (value: IUpdateBasketProduct) => {
    const trimmedObject = trimValues(value);

    updateBasketProduct({
      ...trimmedObject,
      productId: sellerStore?.sellerSingleBasketModal?.product?.id!,
    });
  };

  const handleModalClose = () => {
    sellerStore.setSellerSingleBasketModal(null);
    sellerStore.setIsOpenBasketProductUpdateModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleChangePriceWithSale = (value: number | null) => {
    if (oldPriceFactor) {
      const salePrice = oldPriceFactor?.retailPrice - (value || 0);
      const allSale = (salePrice / oldPriceFactor?.retailPrice) * 100;
      const sellerSale = allSale - (sellerStore.sellerSingleBasketModal?.product?.promotion || 0);

      form.setFieldValue('fixForSeller', sellerSale);
    }
  };

  const handleChangeSellerSale = (value: number | null) => {
    if (oldPriceFactor) {
      const allSale = (value || 0) + (sellerStore.sellerSingleBasketModal?.product?.promotion || 0)!;
      const thenSaleChangePriceWithSale = oldPriceFactor?.retailPrice - ((oldPriceFactor?.retailPrice * (allSale)) / 100);

      form.setFieldValue('priceWithSale', thenSaleChangePriceWithSale);
    }
  };

  useEffect(() => {
    if (sellerStore.sellerSingleBasketModal?.product?.oldPriceFactor) {
      const productOldPriceFactor = sellerStore.sellerSingleBasketModal?.product?.oldPriceFactor;
      const product = sellerStore.sellerSingleBasketModal?.product;
      const promotionSale = product?.promotion || 0;
      const fixForSeller = product?.fixForSeller || 0;
      const allSale = promotionSale + fixForSeller;
      const maxPriceWithSaleValue = productOldPriceFactor?.retailPrice - ((productOldPriceFactor?.retailPrice * promotionSale) / 100);
      const priceWithSale = productOldPriceFactor?.retailPrice - ((productOldPriceFactor?.retailPrice * allSale) / 100);
      const productMaxSellerSale = 100 - promotionSale;

      setOldPriceFactor(productOldPriceFactor);
      setMaxPriceWithSale(maxPriceWithSaleValue);
      setMaxSellerSale(productMaxSellerSale);
      form.setFieldValue('priceWithSale', priceWithSale);
      form.setFieldValue('fixForSeller', sellerStore.sellerSingleBasketModal?.product?.fixForSeller);
    }
  }, [sellerStore?.sellerSingleBasketModal]);

  return (
    <Modal
      open={sellerStore.isOpenBasketProductUpdateModal}
      title={'Обновить товар в корзине'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={updateProductLoading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Alert
          message={`Цена: ${priceFormat(oldPriceFactor?.retailPrice)} сум`}
          style={{marginBottom: '20px'}}
        />
        <Alert
          message={`Скидка: ${sellerStore.sellerSingleBasketModal?.product?.promotion}%`}
          style={{marginBottom: '20px'}}
        />
        <Form.Item
          name="priceWithSale"
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
            sellerStore?.sellerSingleBasketModal?.product?.fromWarehouse
              ? `Max: ${sellerStore?.sellerSingleBasketModal?.product?.quantity}`
              : ''
          }`}
          rules={[
            {required: true},
            ...(sellerStore?.sellerSingleBasketModal?.product?.fromWarehouse
              ? [{
                message: `Максимальное количество ${sellerStore?.sellerSingleBasketModal?.product?.quantity}`,
                validator(rule: any, value: number) {
                  if (value > sellerStore?.sellerSingleBasketModal?.product?.quantity!) {
                    return Promise.reject();
                  } else {
                    return Promise.resolve();
                  }
                },
              }] : [])
            ,
          ]}
          validateTrigger="onChange"
          initialValue={sellerStore?.sellerSingleBasketModal?.product?.quantity}
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
