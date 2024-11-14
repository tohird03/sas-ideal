import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IEditProductStatusQty} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

export const StorekeeperEditStatusBasketModal = observer(() => {

  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleModalClose = () => {
    storekeeperStore.setIsOpenStorekeeperEditStatusBasketModal(false);
  };


  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
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
      productStatusId: storekeeperStore?.cartProduct?.productStatus?.id,
      quantity: storekeeperStore.cartProduct?.quantity,
    });
  }, []);

  const {mutate: editCartProductStatusQty} = useMutation({
    mutationFn: (params: IEditProductStatusQty) =>
      storekeeperApi.editCartProductStatusQty(storekeeperStore.cartProduct?.cartId || '', params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCartProducts']});
      handleModalClose();
      addNotification('Успешно завершено');
    },
    onError: addNotification,
  });


  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IEditProductStatusQty) => {
    if (values) {
      const clearedUndifineObj = removeUndefinedValues(values);

      editCartProductStatusQty(clearedUndifineObj);
    }
  };

  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperEditStatusBasketModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        title="Изменить статус"
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
              placeholder="Статус"
              filterOption={filterOption}
              optionFilterProp="children"
              loading={productStatusDataLoading}
              options={productStatusOptions}
            />

          </Form.Item>
          <Form.Item
            label={`Изменить из ${storekeeperStore.cartProduct?.quantity}`}
            name="quantity"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[{
              validateTrigger: 'onChange',
              validator: (rule, value) => new Promise<void>((resolve, reject) => {
                if (value) {
                  if (Number(value) > Number(storekeeperStore.cartProduct?.quantity)) {
                    reject('не должно быть больше количества товара!');
                  } else {
                    resolve();
                  }
                } else {
                  resolve();
                }
              }),
            }]}
          >
            <InputNumber
              min={'1'}
              placeholder={`${storekeeperStore.cartProduct?.quantity} шт`}
              style={{width: '100%'}}
              parser={parser}
            />

          </Form.Item>
        </Form>

      </Modal>
    </>
  );
});
