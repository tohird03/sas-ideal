import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IAddProductBasketType} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

export const StorekeeperAddProductBasketModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
  };

  const handleModalClose = () => {
    storekeeperStore.
      setIsOpenStorekeeperAddProductBasketModal(false);
  };

  const filterOption = (input: string, option?:
  {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const {data: productStatusData, isLoading: productStatusDataLoading} = useQuery({
    queryKey: ['getproductStatusData'],
    queryFn: () => storekeeperApi.getProductStatus(
      {
        pageNumber: 1,
        pageSize: 20,
      }
    ),
  });

  const productStatusOptions = useMemo(() => (
    productStatusData?.productStatusList
      .filter(el => el?.name !== 'uploaded')
      .map((el, i) => ({
        value: el?.id,
        label: el?.name,
        key: i,
      }))
  ), [productStatusData]);

  useEffect(() => {
    form.setFieldsValue({
      quantity: storekeeperStore.addProductBasket?.quantity,
      partId: storekeeperStore.addProductBasket?.partId,
    });
  }, []);

  const {mutate: addProductBasketFunc} = useMutation({
    mutationFn: (params: IAddProductBasketType) =>
      storekeeperApi.addPoductBaket({
        ...params,
        pmsProductId: storekeeperStore.addProductBasket?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProducts']});
      handleModalClose();
      addNotification('Успешно завершено');
    },
    onError: addNotification,
  });

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddProductBasketType) => {
    if (values) {
      const clearedUndifineObj = removeUndefinedValues(values);

      addProductBasketFunc(clearedUndifineObj);
    }
  };


  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperAddProductBasketModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        title="В корзинку"
        centered
        width={'500px'}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Статус"
            name="productStatusId"
            style={{width: '100%'}}
          >
            <Select
              options={productStatusOptions}
              loading={productStatusDataLoading}
              filterOption={filterOption}
              optionFilterProp="children"
              placeholder="Статус"
            />
          </Form.Item>
          <Form.Item
            label={'Изменить ИД'}
            name="partId"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[
              {required: true},
              {
                validateTrigger: 'onChange',
                validator: (rule, value) =>
                  new Promise<void>((resolve, reject) => {
                    if (value) {
                      if (`${value}`.length < 7) {
                        reject('Не менее 7 цифр');
                      } else {
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  }),
              },
            ]}
          >
            <InputNumber
              placeholder={`${storekeeperStore.addProductBasket?.partId || `${1234567}`}`}
              style={{width: '100%'}}
              parser={parser}
            />
          </Form.Item>
          <Form.Item
            label="Сколько"
            name="quantity"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[
              {
                required: true,
                validateTrigger: 'onChange',
                validator: (rule, value) =>
                  new Promise<void>((resolve, reject) => {
                    if (value) {
                      if (
                        Number(value) >
                        Number(storekeeperStore.addProductBasket?.quantity)
                      ) {
                        reject('не должно быть больше количества товара!');
                      } else {
                        resolve();
                      }
                    } else {
                      resolve();
                    }
                  }),
              },
            ]}
          >
            <InputNumber
              min={'1'}
              placeholder={`${storekeeperStore.addProductBasket?.quantity} шт`}
              style={{width: '100%'}}
              parser={parser}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

