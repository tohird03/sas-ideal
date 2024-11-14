import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {IPatchManagerTissue, IPostManagerTissue} from '@/api/productmanager/tyes';
import {categoriesStore} from '@/stores/categories';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';

export const ProductManagerTissueAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>();

  const {mutate: addTissue} = useMutation({
    mutationFn: (params: IPostManagerTissue) => productManagerStore.postTissue(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['getTissue']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const {mutate: updateTissue} = useMutation({
    mutationFn: (params: IPatchManagerTissue) =>
      productManagerStore.patchTissue(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['getTissue']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const handleSubmit = (value: IPostManagerTissue) => {
    setLoading(true);

    if (productManagerStore.isEditTissueProduct) {
      updateTissue({
        id: productManagerStore?.isEditTissueProduct?.id,
        name: value.name,
      });
    } else {
      addTissue({
        name: value.name,
      });
    }
  };

  const handleModalClose = () => {
    productManagerStore.setIsOpenTissueAddEditModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (productManagerStore.isEditTissueProduct) {
      form.setFieldsValue(productManagerStore.isEditTissueProduct);
    }
  }, [productManagerStore.isEditTissueProduct]);

  return (
    <Modal
      open={productManagerStore.isOpenTissueAddEditModal}
      title={categoriesStore.singleCategory ? 'Изменить Ткань' : 'Новая Ткань'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Сохранить"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Название Ткань"
          rules={[{required: true}]}
        >
          <Input placeholder="Название Ткань" value={value?.trim()} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
