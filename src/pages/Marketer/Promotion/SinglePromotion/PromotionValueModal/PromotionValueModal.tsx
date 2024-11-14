import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {promotionApi} from '@/api/promotion';
import {IAddEditPromotionProduct, IPromotionProducts} from '@/api/promotion/types';
import {promotionStore} from '@/stores/marketer';
import {addNotification} from '@/utils';

function findMinimumCountObject(product: IPromotionProducts[]) {
  if (product.length === 0) {
    return null; // Return null if the array is empty
  }

  let minObject = product[0]; // Start with the first object as the minimum

  for (let i = 1; i < product.length; i++) {
    if (product[i].discount < minObject.discount) {
      minObject = product[i]; // Update minObject if current object has a smaller count
    }
  }

  return minObject;
}

export const PromotionValueModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const {promotionId} = useParams();
  const [updateLimitDiscount, setUpdateLimitDiscount] = useState<number | null>(null);

  const {mutate: addPromotionProducts} =
    useMutation({
      mutationKey: ['addPromotionProducts'],
      mutationFn: (params: IAddEditPromotionProduct) => promotionApi.addPromotionProducts(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getSinglePromotionProducts']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updatePromotionProducts} =
    useMutation({
      mutationKey: ['updatePromotionProducts'],
      mutationFn: (params: IAddEditPromotionProduct) => promotionApi.updatePromotionProducts(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getSinglePromotionProducts']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalClose = () => {
    promotionStore.setPromotionProducts([]);
    promotionStore.setPrmotionUpdateProducts(null);
    promotionStore.setPromotionProductUpdateSelectedProductsKeys([]);
    promotionStore.setIsOpenAddProductModal(false);
    promotionStore.setIsOpenPromotionValueModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (value: {discount: number}) => {
    setLoading(true);

    if (promotionStore.prmotionUpdateProducts) {
      updatePromotionProducts({
        discount: value?.discount,
        products: promotionStore.prmotionUpdateProducts?.map(product => product?.id),
        promotionId: promotionId!,
      });

      return;
    }

    addPromotionProducts({
      discount: value?.discount,
      products: promotionStore.promotionProducts?.map(product => product?.id),
      promotionId: promotionId!,
    });
  };

  useEffect(() => {
    if (promotionStore.prmotionUpdateProducts?.length) {
      const minDisCount = findMinimumCountObject(promotionStore.prmotionUpdateProducts)?.discount;

      setUpdateLimitDiscount(minDisCount!);
    }
  }, [promotionStore.prmotionUpdateProducts]);

  return (
    <Modal
      open={promotionStore.isOpenPromotionValueModal}
      title={updateLimitDiscount ? `Лимит скидки: ${updateLimitDiscount}` : 'Скидка'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
      width={400}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="discount"
          label="Скидка"
          rules={[{required: true}]}
        >
          <InputNumber
            placeholder="Скидка"
            style={{width: '100%'}}
            max={updateLimitDiscount!}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
