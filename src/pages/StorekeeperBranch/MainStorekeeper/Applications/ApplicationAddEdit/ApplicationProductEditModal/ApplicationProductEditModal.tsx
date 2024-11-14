import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal} from 'antd';
import {IEditReqProductParams} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

export const ApplicationProductEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const handleModalClose = () => {
    mainStorekeeperStore.setIsOpenEditReqProductModal(false);
    form.resetFields();
  };

  const {mutate: editReqProductFunc} = useMutation({
    mutationFn: (params: IEditReqProductParams) =>
      mainStorekeeperStore.editReqProduct(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getByIdProduct'],
      });
      handleModalClose();
      addNotification('Успешно завершено');
    },
    onError: addNotification,
    onSettled: async () => {
      setEditLoading(false);
    },
  });

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: {quantity: string}) => {
    setEditLoading(true);

    editReqProductFunc({
      id: mainStorekeeperStore.reqProductQty?.id,
      quantity: parseFloat(values?.quantity),
    });
  };

  return (
    <>
      <Modal
        open={mainStorekeeperStore.isOpenEditReqProductModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        confirmLoading={editLoading}
        title={'Изменить количество'}
        centered
        width={'400px'}
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
            rules={[
              {required: true},
              {
                validateTrigger: 'onChange',
                validator: (rule, value) =>
                  new Promise<void>((resolve, reject) => {
                    if (value) {
                      if (
                        Number(value) >
                        mainStorekeeperStore.reqProductQty?.quantity
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
            label={'Количество'}
            name="quantity"
            initialValue={mainStorekeeperStore.reqProductQty?.quantity}
          >
            <InputNumber
              min={1}
              style={{width: '100%'}}
              placeholder={`${mainStorekeeperStore.reqProductQty?.quantity} шт`}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
