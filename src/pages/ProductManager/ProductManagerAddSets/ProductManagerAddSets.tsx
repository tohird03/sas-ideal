import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Button, message, Steps, Typography} from 'antd';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {ProductManagerSetsAddModal} from './ProductManagerSetsAddModal';
import {ProductManagerSetsProduct} from './ProductManagerSetsProductTable/ProductManagerAddSetsProductTable';
import {ProductManagerSetsAddProduct} from './ProductManagerTasksAddProduct';

const {Step} = Steps;

const steps = [
  {
    title: 'Задачи',
    content: <ProductManagerSetsAddProduct />,
  },
  {
    title: 'Продукты',
    content: <ProductManagerSetsProduct />,
  },
];

export const ProductManagerAddSets = observer(() => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(prevCurrent => prevCurrent + 1);
  };

  const prev = () => {
    setCurrent(prevCurrent => prevCurrent - 1);
  };

  return (
    <>
      <Typography.Title level={3} style={{textAlign: 'center', marginBottom: '15px'}}>
        Процесс до оформления заказа
      </Typography.Title>
      <Steps style={{marginBottom: '50px'}} current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{marginTop: 16}}>
        {steps[current].content}
      </div>
      <div style={{marginTop: 24}}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Далее
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Сделанный
          </Button>
        )}
        {current > 0 && (
          <Button style={{margin: '0 8px'}} onClick={prev}>
            Отмена
          </Button>
        )}
      </div>
      {productManagerStore.isProductSetsAddProductModal && <ProductManagerSetsAddModal />}
    </>
  );
});
