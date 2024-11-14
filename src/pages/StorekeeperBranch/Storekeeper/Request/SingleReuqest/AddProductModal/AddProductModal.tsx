import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select} from 'antd';
import {storekeeperApi} from '@/api/storekeeper/storekeeper';
import {IAddProductFromRequest} from '@/api/storekeeper/types';
import {storekeeperRequestStore} from '@/stores/storekeeper';
import {addNotification} from '@/utils';

export const AddProductModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: createProductFromRequest} =
  useMutation({
    mutationKey: ['createProductFromRequest'],
    mutationFn: (params: IAddProductFromRequest) => storekeeperApi.createProduct(params),
    onSuccess: () => {
      addNotification('Успех создания продукта');
      queryClient.invalidateQueries({queryKey: ['getSingleRequest']});
      setLoading(false);
      handleModalClose();
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });

  const {data: productStatusData, isLoading: productStatusDataLoading} = useQuery({
    queryKey: ['getproductStatusData'],
    queryFn: () => storekeeperApi.getProductStatus({
      pageNumber: 1,
      pageSize: 20,
    }),
  });

  const handleFinishAdd = () => {
    form.submit();
  };

  const handleModalClose = () => {
    storekeeperRequestStore.setSingleRequestToWarehouseProducts(null);
    storekeeperRequestStore.setIsOpenAddProductModal(false);
  };

  const handleAddProduct = (value: IAddProductFromRequest) => {
    if (storekeeperRequestStore?.singleRequestToWarehouseProducts) {
      setLoading(true);
      createProductFromRequest({
        productStatusId: value?.productStatusId,
        productId: storekeeperRequestStore?.singleRequestToWarehouseProducts?.id,
        partId: storekeeperRequestStore?.singleRequestToWarehouseProducts?.partId!,
        quantity: value?.quantity,
      });
    }
  };

  const productStatusOptions = useMemo(() =>
    productStatusData?.productStatusList
      .filter((el) => el?.name === 'active' || el?.name === 'defected')
      .map((el, i) => ({
        value: el?.id,
        label: el?.name,
        key: i,
      })),
  [productStatusData]);

  return (
    <Modal
      open={storekeeperRequestStore?.isOpenAddProductModal}
      onOk={handleFinishAdd}
      onCancel={handleModalClose}
      title={`Принять продукт ${storekeeperRequestStore?.singleRequestToWarehouseProducts?.partId}`}
      confirmLoading={loading}
      centered
    >
      <Form
        layout="vertical"
        onFinish={handleAddProduct}
        form={form}
      >
        <Form.Item
          hasFeedback
          label={`Принять из ${storekeeperRequestStore?.singleRequestToWarehouseProducts?.count} шт`}
          name="quantity"
          rules={[
            {
              message: `Номер продукта должен быть меньше
                ${storekeeperRequestStore?.singleRequestToWarehouseProducts?.count}!`,
              validator(rule, value) {
                if (value > storekeeperRequestStore?.singleRequestToWarehouseProducts?.count!) {
                  return Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
          validateTrigger="onChange"
        >
          <InputNumber
            placeholder={`${storekeeperRequestStore?.singleRequestToWarehouseProducts?.count} шт`}
            style={{width: '100%'}}
            type="number"
          />
        </Form.Item>
        <Form.Item
          label="Статус"
          name="productStatusId"
          style={{width: '100%'}}
        >
          <Select
            placeholder="Статус"
            optionFilterProp="children"
            loading={productStatusDataLoading}
            options={productStatusOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
