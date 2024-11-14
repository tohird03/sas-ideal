import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';

interface IStorekeeperMainCategoryType {
  id: string;
  category: string;
}
interface IStorekeeperMainModelType {
  id: string;
  model: string;
}

export const StorekeeperMainProductAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const [storekeeperCategory, setStorekeeperCategory] = useState<IStorekeeperMainCategoryType[]>([
    {
      category: 'Category 1',
      id: '1',
    },
    {
      category: 'Category 2',
      id: '2',
    },
    {
      category: 'Category 3',
      id: '3',
    },
  ]);

  const [storekeeperModel, setStorekeeperModel] = useState<IStorekeeperMainModelType[]>([
    {
      model: 'model 1',
      id: '1',
    },
    {
      model: 'model 2',
      id: '2',
    },
    {
      model: 'model 3',
      id: '3',
    },
  ]);

  const handleModalClose = () => {
    storekeeperStore.setIsOpenStorekeeperMainProductAddEditModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: any) => {
    console.log('Submitted Form', values);
    storekeeperStore.setIsOpenStorekeeperMainProductAddEditModal(false);
    storekeeperStore.setIsEditStorekeeperMainProduct(null);
  };


  const filterOption = (input: string, option?: {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleStorekeeperCategoryChange = (value: any) => {
    console.log('Tanlangan kategoriya:', value);
  };


  useEffect(() => {
    if (storekeeperStore.isEditStorekeeperMainProduct) {
      form.setFieldsValue(storekeeperStore.isEditStorekeeperMainProduct);
    }
  }, [storekeeperStore.isEditStorekeeperMainProduct]);


  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperMainProductAddEditModal}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        centered
        title="Новый продукт"
        width={500}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical" autoComplete="off"
        >
          <Form.Item label="Ид" name="productId" rules={[{required: true}]}>
            <Input placeholder="Ид" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
            rules={[{required: true}]}
          >
            <Select
              showSearch
              placeholder="Категория"
              filterOption={filterOption}
              options={storekeeperCategory.map((category) => ({
                value: category.id,
                label: category?.category,
              }))}
              onChange={handleStorekeeperCategoryChange}
            />
          </Form.Item>

          <Form.Item
            name="model"
            label="Модел"
            rules={[{required: true}]}
          >
            <Select
              showSearch
              placeholder="Модел"
              filterOption={filterOption}
              options={storekeeperModel.map((model) => ({
                value: model.id,
                label: model?.model,
              }))}
              onChange={handleStorekeeperCategoryChange}
            />
          </Form.Item>

          <div style={{display: 'flex', gap: '10px', justifyContent: 'space-between'}}>
            <Form.Item style={{width: '50%'}} label="Tкань" name="tissue" rules={[{required: true}]}>
              <Input placeholder="Tкань" />
            </Form.Item>
            <Form.Item style={{width: '50%'}} label="Кол-во" name="qty" rules={[{required: true}]}>
              <Input placeholder="Кол-во" />
            </Form.Item>
          </div>

          <Form.Item label="Заглавие..." name="title" rules={[{required: true}]}>
            <TextArea placeholder="Заглавие..." allowClear />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
});
