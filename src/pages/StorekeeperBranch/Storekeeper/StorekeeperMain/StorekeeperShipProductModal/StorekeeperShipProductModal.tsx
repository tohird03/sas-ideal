import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IEditProductStatusQty} from '@/api/storekeeper/types';
import {storekeeperStore} from '@/stores/storekeeper/storekeeper';
import {addNotification} from '@/utils';

export const StorekeeperShipProductModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const handleModalClose = () => {
    storekeeperStore.setIsOpenStorekeeperShipProductModal(false);
  };

  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
  };

  const {data: productStatusData} = useQuery({
    queryKey: ['getproductStatusData'],
    queryFn: () =>
      storekeeperApi.getProductStatus({
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {mutate: editProductQty} = useMutation({
    mutationFn: (params: IEditProductStatusQty) =>
      storekeeperApi.editProductStatusQty(
        storekeeperStore.oneProduct?.wmsProductId || '',
        params
      ),
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
    const uploadedStatus = productStatusData?.productStatusList?.find(
      (el) => el?.name === 'uploaded'
    );

    if (values) {
      editProductQty({
        productStatusId: uploadedStatus?.id,
        quantity: values?.quantity,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      quantity: storekeeperStore.oneProduct?.quantity,
    });
  }, []);

  return (
    <>
      <Modal
        open={storekeeperStore.isOpenStorekeeperShipProductModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        // confirmLoading={modalLoading}
        title={`Отгрузить продукт ${storekeeperStore.oneProduct?.partId}`}
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
            label={`Списать из ${storekeeperStore.oneProduct?.quantity}`}
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
              style={{width: '100%'}}
              placeholder={`${storekeeperStore.oneProduct?.quantity} шт`}
              parser={parser}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
