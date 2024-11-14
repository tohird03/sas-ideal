import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IEditProductStatusQty} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';
import {removeUndefinedValues} from '@/utils/removeUndifinedValue';

export const StorekeeperEditStatusMainModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleModalClose = () => {
    storekeeperStore.setIsOpenStorekeeperEditStatusMainModal(false);
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

  const productStatusOptions = useMemo(
    () =>
      productStatusData?.productStatusList
        .filter((el) => el?.name === 'active' || el?.name === 'defected')
        .map((el, i) => ({
          value: el?.id,
          label: el?.name,
          key: i,
        })),
    [productStatusData]
  );

  useEffect(() => {
    form.setFieldsValue({
      productStatusId: storekeeperStore.oneProduct?.productStatus.id,
      quantity: storekeeperStore.oneProduct?.quantity,
      partId: storekeeperStore.oneProduct?.partId,
    });
  }, []);

  const {mutate: editProductStatusQty} = useMutation({
    mutationFn: (params: IEditProductStatusQty) =>
      storekeeperApi.editProductStatusQty(storekeeperStore.oneProduct?.wmsProductId || '', params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getAllProducts']});
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

      editProductStatusQty(clearedUndifineObj);
    }
  };


  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperEditStatusMainModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        title={`Изменить статус ${storekeeperStore.oneProduct?.partId}`}
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
            label={'Изменить ИД'}
            name="partId"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[
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
              placeholder={`${storekeeperStore.oneProduct?.partId}`}
              style={{width: '100%'}}
              parser={parser}
            />
          </Form.Item>
          <Form.Item
            label={`Изменить из ${storekeeperStore.oneProduct?.quantity}`}
            name="quantity"
            style={{width: '100%'}}
            dependencies={['number']}
            rules={[
              {
                validateTrigger: 'onChange',
                validator: (rule, value) =>
                  new Promise<void>((resolve, reject) => {
                    if (value) {
                      if (
                        Number(value) >
                        Number(storekeeperStore.oneProduct?.quantity)
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
              placeholder={`${storekeeperStore.oneProduct?.quantity} шт`}
              style={{width: '100%'}}
              parser={parser}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
