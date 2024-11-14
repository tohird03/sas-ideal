import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {expenseTypeApi} from '@/api/expenseType/expenseType';
import {IAddEditExpenseTypeParams} from '@/api/expenseType/type';
import {pmExpenseStore} from '@/stores/productManager';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditExpenseModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addExpenseType} =
    useMutation({
      mutationKey: ['addExpenseType'],
      mutationFn: (params: IAddEditExpenseTypeParams) => expenseTypeApi.addExpenseType(params),
      onSuccess: () => {
        addNotification('Успешное добавление типа расходов');
        queryClient.invalidateQueries({queryKey: ['getExpenseType']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateExpenseType} =
    useMutation({
      mutationKey: ['updateExpenseType'],
      mutationFn: (params: IAddEditExpenseTypeParams) => expenseTypeApi.updateExpenseType(params),
      onSuccess: () => {
        addNotification('Успешное изменение типа расходов');
        queryClient.invalidateQueries({queryKey: ['getExpenseType']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddEditExpenseTypeParams) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (pmExpenseStore?.singleExpenseType) {
      updateExpenseType({
        ...trimmedObject,
        id: pmExpenseStore?.singleExpenseType?.id,
      });

      return;
    }
    addExpenseType(trimmedObject);
  };

  const handleModalClose = () => {
    pmExpenseStore.setIsOpenAddEditExpenseModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (pmExpenseStore?.singleExpenseType) {
      form.setFieldsValue(pmExpenseStore.singleExpenseType);
    }
  }, [pmExpenseStore.singleExpenseType]);

  return (
    <Modal
      open={pmExpenseStore.isOpenAddEditExpenseModal}
      title={pmExpenseStore?.singleExpenseType ? 'Изменить Категория расходов' : 'Новый Категория расходов'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
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
          label="Категория расходов"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Категория расходов" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
