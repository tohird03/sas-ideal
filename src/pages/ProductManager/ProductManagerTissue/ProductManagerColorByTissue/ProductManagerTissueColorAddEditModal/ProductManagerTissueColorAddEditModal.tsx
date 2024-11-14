import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ColorPicker, Form, Input, Modal, theme} from 'antd';
import {Color} from 'antd/es/color-picker';
import {IGetManagerTissueList} from '@/api/productmanager/tyes';
import {categoriesStore} from '@/stores/categories';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {addNotification} from '@/utils';

export const ProductManagerTissueColorAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>();
  const {token} = theme.useToken();
  const {id} = useParams();

  const [color, setColor] = useState<Color | string>(token.colorPrimary);

  const {mutate: postColorByTissue} = useMutation({
    mutationFn: (params: IGetManagerTissueList) => productManagerStore.postColorByTissue(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['getColorByTissue']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });


  const {mutate: patchColorByTissue} = useMutation({
    mutationFn: (params: IGetManagerTissueList) =>
      productManagerStore.patchColorByTissue(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['getColorByTissue']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const handleSubmit = (value: IGetManagerTissueList) => {
    setLoading(true);
    const colorValue = typeof color === 'string' ? color : color.toHexString();

    if (productManagerStore.isEditTissueColorProduct) {
      patchColorByTissue({
        id: productManagerStore?.isEditTissueColorProduct?.id,
        tissueColorsToConnect: [],
        tissueColorsToDisconnect: [],
        name: value.name,
        hexColor: colorValue,
      });
    } else {
      postColorByTissue({
        name: value.name,
        hexColor: colorValue,
        tissueId: id!,
      });
    }
  };

  const handleModalClose = () => {
    productManagerStore.setIsOpenTissueColorAddEditModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (productManagerStore.isEditTissueColorProduct) {
      form.setFieldsValue(productManagerStore.isEditTissueColorProduct);
    }
  }, [productManagerStore.isEditTissueColorProduct]);

  return (
    <Modal
      open={productManagerStore.isOpenTissueColorAddEditModal}
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
        <Form.Item name="color">
          <ColorPicker
            value={color}
            onChange={setColor}
            showText={(color) => (
              <span>Custom Text ({color.toHexString()})</span>
            )}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
});
