/* eslint-disable max-len */
import './productmanagersetsaddmodal.scss';

import React from 'react';
import {observer} from 'mobx-react';
import {Button, Form, Input, Modal, Select, Typography} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {useMediaQuery} from '@/utils/mediaQuery';

export const ProductManagerSetsAddModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [form] = useForm();
  const handlePageChange = () => {
    console.log('Page Changed');
  };

  const handleSubmit = () => {
    productManagerStore.setIsProductSetsAddProductModal(false);
    productManagerStore.setIsAddProductSetModal(false);
    productManagerStore.setSetsProductCount(0);
  };

  const handleModalClose = () => {
    productManagerStore.setIsProductSetsAddProductModal(false);
  };

  const handleModalOk = () => {
    handleSubmit();
  };

  const filterOption = (input: string, option?: {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


  const categoryOption = [
    {value: 'category1', label: 'category 1'},
    {value: 'category2', label: 'category 2'},
    {value: 'category3', label: 'category 3'},
  ];

  const modelOption = [
    {value: 'model1', label: 'model 1'},
    {value: 'model2', label: 'model 2'},
    {value: 'model3', label: 'model 3'},
  ];

  const cornerOption = [
    {value: 'corner1', label: 'corner 1'},
    {value: 'corner2', label: 'corner 2'},
    {value: 'corner3', label: 'corner 3'},
  ];

  const fabricColorOption = [
    {value: 'fabric_color1', label: 'fabric color 1'},
    {value: 'fabric_color2', label: 'fabric color 2'},
    {value: 'fabric_color3', label: 'fabric color 3'},
  ];

  const addProductModal = () => {
    productManagerStore.setIsAddProductSetModal(true);
  };

  const handleSetsProductDecrease = () => {
    const count = productManagerStore.setsProductCount !== 0 ? productManagerStore.setsProductCount - 1 : 0;

    productManagerStore.setSetsProductCount(count);
  };

  const handleSetsProductIncrease = () => {
    productManagerStore.setSetsProductCount(productManagerStore.setsProductCount + 1);
  };

  return (
    <>
      <div className="product-manager__sets-add__modal">
        <Modal
          open={productManagerStore.isProductSetsAddProductModal}
          title={'Добавить продукт'}
          onCancel={handleModalClose}
          onOk={handleModalOk}
          okText="Создать"
          cancelText="Отмена"
          centered
          // confirmLoading={loading}
          width={600}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="category"
              label="Категория"
              rules={[{required: true}]}
            >
              <Select
                options={categoryOption}
                placeholder="Категория"
              />
            </Form.Item>

            <Form.Item
              name="model"
              label="Модель"
              rules={[{required: true}]}
            >
              <Select
                options={modelOption}
                placeholder="Модель"
              />
            </Form.Item>

            <Form.Item
              name="corner"
              label="Уголь"
              rules={[{required: true}]}
            >
              <Select
                options={cornerOption}
                placeholder="Уголь"
              />
            </Form.Item>

            <Form.Item
              name="fabric_color"
              label="Цвет ткани"
              rules={[{required: true}]}
            >
              <Select
                options={fabricColorOption}
                placeholder="Цвет ткани"
              />
            </Form.Item>
          </Form>

          <div className="nimadir">
            <div className="product-manager__container">
              <div className="product-manager-content">
                <div className="product-manager__content_img">
                  <img src="https://wallpapercg.com/media/ts_2x/14077.webp" alt="" />
                </div>
                <div className="product-manager__content_info">
                  <span>empty</span>
                  <h3>empty</h3>
                </div>
                {
                  !productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content__add-button">
                        <Button onClick={addProductModal} type="primary" className="add_button">Добавить</Button>
                      </div>
                    </>
                  )
                }
                {
                  productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content_counter">
                        <Button onClick={handleSetsProductDecrease} className="decrease">-</Button>
                        <span>{productManagerStore.setsProductCount}</span>
                        <Button onClick={handleSetsProductIncrease} className="increase">+</Button>
                      </div>
                    </>
                  )
                }
              </div>
              <div className="product-manager-content">
                <div className="product-manager__content_img">
                  <img src="https://wallpapercg.com/media/ts_2x/14077.webp" alt="" />
                </div>
                <div className="product-manager__content_info">
                  <span>empty</span>
                  <h3>empty</h3>
                </div>
                {
                  !productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content__add-button">
                        <Button onClick={addProductModal} type="primary" className="add_button">Добавить</Button>
                      </div>
                    </>
                  )
                }
                {
                  productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content_counter">
                        <Button onClick={handleSetsProductDecrease} className="decrease">-</Button>
                        <span>{productManagerStore.setsProductCount}</span>
                        <Button onClick={handleSetsProductIncrease} className="increase">+</Button>
                      </div>
                    </>
                  )
                }
              </div>
              <div className="product-manager-content">
                <div className="product-manager__content_img">
                  <img src="https://wallpapercg.com/media/ts_2x/14077.webp" alt="" />
                </div>
                <div className="product-manager__content_info">
                  <span>empty</span>
                  <h3>empty</h3>
                </div>
                {
                  !productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content__add-button">
                        <Button onClick={addProductModal} type="primary" className="add_button">Добавить</Button>
                      </div>
                    </>
                  )
                }
                {
                  productManagerStore.isAddProductSetModal && (
                    <>
                      <div className="product-manager__content_counter">
                        <Button onClick={handleSetsProductDecrease} className="decrease">-</Button>
                        <span>{productManagerStore.setsProductCount}</span>
                        <Button onClick={handleSetsProductIncrease} className="increase">+</Button>
                      </div>
                    </>
                  )
                }
              </div>

            </div>
            <div style={{marginTop: '10px'}}>
              <span>Общая стоимость: </span>
              <span style={{color: 'green'}}>{productManagerStore.setsProductCount}</span>
            </div>
          </div>

        </Modal>

      </div>
    </>
  );
});
