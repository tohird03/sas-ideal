import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {IAddEditLocation} from '@/api/locations/types';
import {locationsStore} from '@/stores/dms';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditLocationModal = observer(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {mutate: addLoaction} =
    useMutation({
      mutationKey: ['addLocation'],
      mutationFn: (params: IAddEditLocation) => locationsStore.addLocation(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getLocations']});
        handleCancel();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateLocation} =
    useMutation({
      mutationKey: ['updateLocation'],
      mutationFn: (params: IAddEditLocation) => locationsStore.updateLocation(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getLocations']});
        handleCancel();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    locationsStore.setSingleLocation(null);
    locationsStore.setIsOpenAddEditLocationModal(false);
  };

  const handleSubmit = (values: IAddEditLocation) => {
    setLoading(true);
    const trimSubmitValues = trimValues(values);

    if (locationsStore?.singleLocation?.id) {
      updateLocation({
        ...trimSubmitValues,
        id: locationsStore?.singleLocation?.id,
      });

      return;
    }

    addLoaction(trimSubmitValues);
  };

  useEffect(() => {
    if (locationsStore?.singleLocation) {
      form.setFieldValue('name', locationsStore?.singleLocation?.name);
    }
  }, [locationsStore?.singleLocation]);

  return (
    <Modal
      centered
      title={locationsStore?.singleLocation?.id ? 'Изменить локации' : 'Создать локации'}
      open={locationsStore.isOpenAddEditLocationModal}
      onOk={handleModalOk}
      onCancel={handleCancel}
      okText={locationsStore?.singleLocation?.id ? 'Изменить' : 'Создать'}
      cancelText="Отмена"
      confirmLoading={loading}
      width={400}
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[
            {required: true, message: 'Name is required'},
            notEmptyFieldRules(),
          ]}
          label="Наименование"
        >
          <Input placeholder="Название локации" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
