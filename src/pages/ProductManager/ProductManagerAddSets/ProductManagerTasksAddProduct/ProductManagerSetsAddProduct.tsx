import './productmanagersetsaddproduct.scss';

import React from 'react';
import {observer} from 'mobx-react';
import {UploadOutlined} from '@ant-design/icons';
import {Button,
  Form,
  Input,
  InputNumber,
  Upload,
  UploadFile,
} from 'antd';
import {Carusel} from './Carusel';

export const ProductManagerSetsAddProduct = observer(() => {
  const [form] = Form.useForm();

  const fileList: UploadFile[] = [];


  return (
    <>
      <main className="product-create__container">
        <div className="product-create__card">
          <div className="product-create__img">
            <Carusel />
          </div>

          <div className="product-create__content">
            <div className="product-create__info">
              <Form form={form} layout="vertical" autoComplete="off">
                <Form.Item name="name" label="Название модели" rules={[{required: true}]}>
                  <Input />
                </Form.Item>
                <Form.Item name="category" label="Категория" rules={[{required: true}]}>
                  <Input />
                </Form.Item>

                <Form.Item name="providerName" label="Имя поставщика" rules={[{required: true}]}>
                  <Input />
                </Form.Item>

                <Form.Item name="price" label="Цена" rules={[{required: true}]}>
                  <InputNumber
                    placeholder="Цена"
                    style={{width: '100%'}}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g,
                      ' ')}
                    parser={(value: any) => value.replace(/[A-Z]|[a-z]|[$ ]|\.+/g, '')}
                  />
                </Form.Item>
                <Form.Item name="title" label="Title">
                  <Input.TextArea placeholder="Заглавие" />
                </Form.Item>
              </Form>
            </div>

            <div className="product-create__files">
              <div className="product-create__file__card">
                <div className="product-create__upload__button">
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    defaultFileList={fileList}
                    multiple
                    beforeUpload={() => false}
                    style={{width: '100%'}}
                  >
                    <div className="product-create__upload__title">
                      <span>Файлы</span>
                      <Button icon={<UploadOutlined />}>Добавить файл</Button>
                    </div>
                  </Upload>
                </div>

                <div className="product-create__buttons__card">
                  <div>
                    <span>Оценка продавца</span>
                  </div>
                  <div className="product-create__buttons">
                    {/* <Button onClick={handleEditWorkOnProduct}>
                    Редактировать
                  </Button> */}
                    <Button type="primary">Заканчивать</Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
});
