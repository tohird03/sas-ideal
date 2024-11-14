import React from 'react';
import {observer} from 'mobx-react';
import {Form, InputNumber, Modal} from 'antd';
import {requestStore} from '@/stores/dms';

export const ProductSplitModal = observer(() => {
  const [form] = Form.useForm();

  const handleModalClose = () => {
    requestStore.setSingleCreateFlightProduct(null);
    requestStore.setIsOpenProductSplitModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: {count: number}) => {
    const findCheckCountUpdateProduct =
    requestStore.createFlightProducts?.find(checkProduct => checkProduct?.productId === requestStore?.singleCreateFlightProduct?.id);

    if (findCheckCountUpdateProduct) {
      const updateCheckProducts = requestStore?.createFlightProducts?.map(checkProduct => {
        if (checkProduct?.productId === findCheckCountUpdateProduct?.productId) {
          return {
            ...checkProduct,
            count: values?.count,
          };
        } else {
          return checkProduct;
        }
      });

      requestStore?.setCreateFlightProducts(updateCheckProducts);
    } else {
      requestStore.setCreateFlightProducts([
        ...requestStore.createFlightProducts,
        {productId: requestStore?.singleCreateFlightProduct?.id!, count: values?.count},
      ]);
    }

    handleModalClose();
  };

  return (
    <Modal
      open={requestStore.isOpenProductSplitModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
      title="Разделить продукт"
      width={400}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label={`Выбрать из ${requestStore?.singleCreateFlightProduct?.count}`}
          rules={[{required: true}]}
          name="count"
          initialValue={requestStore?.singleCreateFlightProduct?.count!}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="10 шт"
            defaultValue={requestStore?.singleCreateFlightProduct?.count!}
            max={requestStore?.singleCreateFlightProduct?.count}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
