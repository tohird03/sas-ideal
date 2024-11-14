import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {wmsProductsApi} from '@/api/wmsProducts';
import {IProviderUploadProduct} from '@/api/wmsProducts/types';
import {relatedProductsStore} from '@/stores/provider/related-products/related-products';
import {addNotification} from '@/utils';

export const UploadProductModal = observer(() => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const {mutate: providerUploadProduct} =
  useMutation({
    mutationKey: ['providerUploadProduct'],
    mutationFn: (params: IProviderUploadProduct) => wmsProductsApi.providerUploadProduct(params!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getStorekeeperProductForProvider']});
      setLoading(false);
      handleModalClose();
    },
    onError: addNotification,
  });

  const handleModalClose = () => {
    relatedProductsStore.setSingleCommonProduct(null);
    relatedProductsStore.setIsOpenProductUploadModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: {quantity: number}) => {
    if (relatedProductsStore?.singleCommonProduct) {
      setLoading(true);

      providerUploadProduct({
        partId: relatedProductsStore?.singleCommonProduct?.partId!,
        quantity: values?.quantity,
        productId: relatedProductsStore?.singleCommonProduct?.wmsProductId,
      });
    }
  };

  return (
    <Modal
      open={relatedProductsStore.isOpenProductUploadModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      title={`Производить ${relatedProductsStore.singleCommonProduct?.partId}`}
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
          label="Списать из 10"
          rules={[{required: true}]}
          name="quantity"
          initialValue={relatedProductsStore?.singleCommonProduct?.quantity}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="10 шт"
            defaultValue={relatedProductsStore?.singleCommonProduct?.quantity}
            max={relatedProductsStore?.singleCommonProduct?.quantity}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
