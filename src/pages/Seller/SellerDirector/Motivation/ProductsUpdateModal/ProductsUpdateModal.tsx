import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {AxiosError} from 'axios';
import {productApi} from '@/api/product_list/product_list';
import {IPmsProductSellerPercentBulkUpdateParams} from '@/api/product_list/types';
import {DataTable} from '@/components/Datatable/datatable';
import {motivationStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';
import {motivationProductsColumns} from '../constants';

export const ProductsUpdateModal = observer(() => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const queryClient = useQueryClient();

  const {mutate: productsSellerPercentBulkUpdate} =
    useMutation({
      mutationKey: ['productsSellerPercentBulkUpdate'],
      mutationFn: (params: IPmsProductSellerPercentBulkUpdateParams) => productApi.productsSellerPercentBulkUpdate(params),
      onSuccess: () => {
        addNotification('Доля продавцов успешно изменена');
        queryClient.invalidateQueries({queryKey: ['getPmProductList']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalClose = () => {
    motivationStore.setIsOpenBulkUpdateModal(false);
  };

  const handleSubmit = (values: {percent: number}) => {
    setLoading(true);
    productsSellerPercentBulkUpdate({
      products: motivationStore?.selectedProducts?.map(product => product?.id),
      percent: values?.percent,
    });
  };

  return (
    <Modal
      open={motivationStore.isOpenBulkUpdateModal}
      onOk={handleModalOk}
      onCancel={handleModalClose}
      title={'Комиссия продавца'}
      confirmLoading={loading}
      width={1000}
      centered
      okButtonProps={{disabled: motivationStore?.selectedProducts?.length === 0}}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Процент от маржи"
          name="percent"
          style={{width: '100%'}}
          rules={[
            {required: true},
            {
              message: 'Max 100%',
              validator(rule, value) {
                if (value > 100) {
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
            placeholder="Процент от маржи"
            formatter={(value) => priceFormat(value!)}
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
      <DataTable
        isMobile={isMobile}
        data={motivationStore?.selectedProducts || []}
        columns={motivationProductsColumns}
        pagination={false}
      />
    </Modal>
  );
});
