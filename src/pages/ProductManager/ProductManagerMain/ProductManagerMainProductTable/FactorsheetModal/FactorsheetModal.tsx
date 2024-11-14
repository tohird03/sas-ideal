import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Form, InputNumber, Modal, Typography} from 'antd';
import classnamesBind from 'classnames/bind';
import {pmProductApi} from '@/api/PmProduct/pmProducts';
import {PmsOldPriceFactor} from '@/api/productmanager/tyes';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import styles from '../../productmanagermain.scss';

const cn = classnamesBind.bind(styles);

export const FactorsheetModal = observer(() => {
  const [costPrice, setCostPrice] = useState<number>(0);
  const [factoryPrice, setFactoryPrice] = useState<number>(0);
  const [investorPrice, setInvestorPrice] = useState<number>(0);
  const [b2b, setB2B] = useState<number>(0);
  const [retailDiscountWithoutDiscounts, setRetailDiscountWithoutDiscounts] = useState<number>(0);

  const [form] = Form.useForm();

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: PmsOldPriceFactor) => {
    pmProductApi.patchProductsBulkUpdate({
      products: productManagerStore.productManagerMainSelectedProduct?.map(el => el?.id)!,
      ...(values?.b2b && {b2b: values?.b2b}),
      ...(values?.costPrice && {costPrice: values?.costPrice}),
      ...(values?.factoryPrice && {factoryPrice: values?.factoryPrice}),
      ...(values?.investorPrice && {investorPrice: values?.investorPrice}),
      ...(values?.retailPrice && {retailPrice: values?.retailPrice}),
    })
      .then((res) => {
        if (res?.status === 204) {
          handleModalClose();
          addNotification('Выполнено успешно');
        }
      })
      .catch(addNotification);
  };

  const handleModalClose = () => {
    productManagerStore.setIsProductManagerMainFactorsheetModal(false);
    productManagerStore.setIsProductManagerMainSelectedProduct([]);
  };

  const handleChangeCostPrice = (value: string | null) => {
    if (!value) {
      setCostPrice(0);

      return;
    }
    setCostPrice(parseFloat(value));
  };
  const handleChangeFactory = (value: string | null) => {
    if (!value) {
      setFactoryPrice(0);

      return;
    }
    setFactoryPrice(parseFloat(value));
  };
  const handleChangeInvestor = (value: string | null) => {
    if (!value) {
      setInvestorPrice(0);

      return;
    }
    setInvestorPrice(parseFloat(value));
  };
  const handleChangeB2B = (value: string | null) => {
    if (!value) {
      setB2B(0);

      return;
    }
    setB2B(parseFloat(value));
  };
  const handleChangeReatil = (value: string | null) => {
    if (!value) {
      setRetailDiscountWithoutDiscounts(0);

      return;
    }
    setRetailDiscountWithoutDiscounts(parseFloat(value));
  };

  const handleCalculate = (): PmsOldPriceFactor => {
    const resultCostPrice = costPrice;
    const resultFactory = costPrice + ((factoryPrice * costPrice) * (1 / 100));
    const resultInvestor = resultFactory + (investorPrice * resultFactory) * (1 / 100);
    const resultB2B = resultInvestor + ((b2b * resultInvestor) * (1 / 100));
    const resultMargin = retailDiscountWithoutDiscounts - resultB2B;
    const resultRetail = (resultMargin * 100) / retailDiscountWithoutDiscounts;

    return {
      costPrice: resultCostPrice,
      factoryPrice: resultFactory,
      investorPrice: resultInvestor,
      b2b: resultB2B,
      retailPrice: resultRetail,
      marginPrice: resultMargin,
    };
  };

  return (
    <>
      <Modal
        open={productManagerStore.isProductManagerMainFactorsheetModal}
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
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Себестоимость"
            name="costPrice"
            style={{marginBottom: '0px', marginTop: '10px'}}
            initialValue={0}
            rules={[{
              validator: (_, value) => parseFloat(value) >= 0
                ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
            }]}
          >
            <InputNumber
              min={'0'}
              formatter={(value) => priceFormat(value!)}
              style={{width: '100%'}}
              placeholder="Себестоимость"
              onChange={handleChangeCostPrice}
            />
          </Form.Item>
          <Typography.Text
            className={cn('resultPrice')}
          >
              в резултате: { priceFormat(handleCalculate()?.costPrice || 0)}
          </Typography.Text>
          <Form.Item
            label="Наценка фабрики %"
            name="factoryPrice"
            style={{marginBottom: '0px', marginTop: '10px'}}
            initialValue={0}
            rules={[{
              validator: (_, value) => parseFloat(value) >= 0
                ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
            }]}
          >
            <InputNumber
              formatter={(value) => priceFormat(value!)}
              min={'0'}
              style={{width: '100%'}}
              placeholder="Наценка фабрики %"
              onChange={handleChangeFactory}
            />
          </Form.Item>
          <Typography.Text
            className={cn('resultPrice')}
          >
              цена на этапе: {priceFormat(handleCalculate()?.factoryPrice || 0)}
          </Typography.Text>
          <Form.Item
            label="Наценка инвестора %"
            name="investorPrice"
            style={{marginBottom: '0px', marginTop: '10px'}}
            initialValue={0}
            rules={[{
              validator: (_, value) => parseFloat(value) >= 0
                ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
            }]}
          >
            <InputNumber
              formatter={(value) => priceFormat(value!)}
              min={'0'}
              style={{width: '100%'}}
              placeholder="Наценка инвестора %"
              onChange={handleChangeInvestor}
            />
          </Form.Item>
          <Typography.Text
            className={cn('resultPrice')}
          >
              в резултате: {priceFormat(handleCalculate()?.investorPrice || 0)}
          </Typography.Text>
          <Form.Item
            label="Оптовая наценка %"
            name="b2b"
            style={{marginBottom: '0px', marginTop: '10px'}}
            initialValue={0}
            rules={[{
              validator: (_, value) => parseFloat(value) >= 0
                ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
            }]}
          >
            <InputNumber
              formatter={(value) => priceFormat(value!)}
              min={'0'}
              style={{width: '100%'}}
              placeholder="Оптовая наценка %"
              onChange={handleChangeB2B}
            />
          </Form.Item>
          <Typography.Text
            className={cn('resultPrice')}
          >
              в резултате: {priceFormat(handleCalculate()?.b2b || 0)}
          </Typography.Text>
          <Form.Item
            label="Розничная цена"
            name="retailPrice"
            style={{marginBottom: '0px', marginTop: '10px'}}
            rules={[{
              validator: (_, value) => parseFloat(value) >= 0
                ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
            }]}
          >
            <InputNumber
              formatter={(value) => priceFormat(value!)}
              style={{width: '100%'}}
              placeholder="Розничная цена"
              onChange={handleChangeReatil}
            />
          </Form.Item>
          <Typography.Text
            className={cn('resultPrice')}
          >
              в резултате: {retailDiscountWithoutDiscounts > 0
              ? handleCalculate()?.retailPrice
              : 0} %
          </Typography.Text>
          <br />
          <Typography.Text
            className={cn('resultPrice')}
          >
              Маржа: {priceFormat(handleCalculate()?.marginPrice || 0)}
          </Typography.Text>
        </Form>
      </Modal>
    </>
  );
});
