import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {IAddProcess} from '@/api/process/types';
import {processStore} from '@/stores/process';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddProcessModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addProcess} =
    useMutation({
      mutationKey: ['addProcess'],
      mutationFn: (params: IAddProcess) => processStore.addProcess(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getProcess']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateProcess} =
    useMutation({
      mutationKey: ['updateProcess'],
      mutationFn: (params: IAddProcess) => processStore.updateProcess(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getProcess']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  useQuery({
    queryKey: ['getProcessUnit'],
    queryFn: () =>
      processStore.getProcessUnit(),
  });

  const handleSubmit = (value: IAddProcess) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (processStore?.singleProcess) {
      updateProcess({
        ...trimmedObject,
        id: processStore?.singleProcess?.id,
      });

      return;
    }
    addProcess(trimmedObject);
  };

  const handleModalClose = () => {
    processStore.setSingleProcess(null);
    processStore.setIsOpenNewProcessModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const unitOptions = useMemo(() => (
    processStore.processUnit?.map(unit => ({
      value: unit?.id,
      label: unit?.name,
    }))
  ), [processStore.processUnit]);

  useEffect(() => {
    if (processStore.singleProcess) {
      form.setFieldsValue(processStore.singleProcess);
      form.setFieldValue('unitId', processStore.singleProcess?.unit?.id);
    }
  }, [processStore.singleProcess]);

  return (
    <Modal
      open={processStore.isOpenAddNewProcessModal}
      title={processStore.singleProcess ? 'Изменить процесс' : 'Новый процесс'}
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
          name="description"
          label="Название процесса"
          rules={[{required: true}]}
        >
          <Input placeholder="Название процесса" />
        </Form.Item>
        <Form.Item
          name="time"
          label="Время процесса"
          rules={[{required: true}]}
        >
          <Input
            placeholder="Время процесса"
            addonAfter="час"
            style={{width: '100%'}}
          />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Стоимость процесса"
          rules={[{required: true}]}
        >
          <InputNumber
            placeholder="Цена продукта"
            style={{width: '100%'}}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          name="unitId"
          label="Единица"
          // rules={[{required: true}]}
        >
          <Select
            options={unitOptions}
            placeholder="Единица"
          />
        </Form.Item>
        <Form.Item
          name="unitAmount"
          label="Количество единиц"
          rules={[{required: true}]}
        >
          <Input
            placeholder="Количество единиц"
            style={{width: '100%'}}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
