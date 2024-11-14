import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {AxiosError} from 'axios';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {IChangeProductMinCount} from '@/api/mainStorekeeper/types';
import {warehouseListStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

export const ChangeMinCountModal = observer(() => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {warehouseId} = useParams();
  const [form] = Form.useForm();

  const {mutate: changeProductMinCount} =
    useMutation({
      mutationKey: ['changeProductMinCount'],
      mutationFn: (params: IChangeProductMinCount) => mainStorekeeperApi.changeProductMinCount(params),
      onSuccess: () => {
        addNotification('Успешно добавлено новый тип склада.');
        queryClient.invalidateQueries({queryKey: ['getWarehouseProducts']});
        handleModalClose();
      },
      onError: (error: AxiosError) => {
        addNotification(error);
      },
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IChangeProductMinCount) => {
    setLoading(true);
    const trimmedObject = trimValues(value);

    changeProductMinCount({
      quantity: trimmedObject?.quantity,
      productId: warehouseListStore?.singleProduct?.wmsProductId!,
      warehouseId: warehouseId!,
    });
  };

  const handleModalClose = () => {
    warehouseListStore.setSingleProduct(null);
    warehouseListStore.setIsOpenProductChangeMinCountModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (warehouseListStore.singleProduct) {
      form.setFieldValue('quantity', warehouseListStore.singleProduct?.minQuantity);
    }
  }, [warehouseListStore.singleProduct]);

  return (
    <Modal
      open={warehouseListStore.isOpenProductChangeMinCountModal}
      title="Изменить минимального остатка"
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Сохранить"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
      width={400}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="quantity"
          label="Сколько"
          rules={[{required: true}]}
        >
          <InputNumber
            min={1}
            placeholder="Сколько"
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
