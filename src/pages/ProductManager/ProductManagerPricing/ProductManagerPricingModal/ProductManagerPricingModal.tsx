import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Form, Input, Modal, Select, Switch} from 'antd';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';

export const ProductManagerPricingAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (value: any) => {
    handleModalClose();
  };

  const handleModalClose = () => {
    productManagerStore.setIsProductManagerPricingModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  // useEffect(() => {
  //   if (processStore.singleProcess) {
  //     form.setFieldsValue(processStore.singleProcess);
  //     form.setFieldValue('unitId', processStore.singleProcess?.unit?.id);
  //   }
  // }, [processStore.singleProcess]);

  useEffect(() => {
    if (productManagerStore.isProductManagerPricingSingle) {
      form.setFieldsValue(productManagerStore.isProductManagerPricingSingle);
    }
  }, [productManagerStore.isProductManagerPricingSingle]);

  const pricingOptions = [
    {value: 'pricing1', label: 'pricing 1'},
    {value: 'pricing2', label: 'pricing 2'},
  ];

  return (
    <Modal
      open={productManagerStore.isProductManagerPricingModal}
      title={productManagerStore.isProductManagerPricingSingle ? 'Изменить ценаобразования' : 'Новый ценаобразования'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Название имя"
          rules={[{required: true}]}
        >
          <Input placeholder="Название имя" />
        </Form.Item>

        <Form.Item
          name="formula"
          label="Название формула"
          rules={[{required: true}]}
        >
          <Input placeholder="Название формула" />
        </Form.Item>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Form.Item
            name="type"
            label="Тип Фактор"
            rules={[{required: true}]}
            style={{width: '50%'}}
          >
            <Select
              options={pricingOptions}
              placeholder="Тип Фактор"
            />
          </Form.Item>
          <span style={{display: 'flex', gap: '10px'}}>
              Тип Фактор:
            <Switch defaultChecked />
          </span>
        </div>
      </Form>
    </Modal>
  );
});
