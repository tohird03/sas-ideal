import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import { staffsStore } from '@/stores/workers';
import { IAddOrEditStaff, staffsApi } from '@/api/staffs';
import { regexPhoneNumber } from '@/utils/phoneFormat';

export const AddStaffsModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addNewStaffs} =
    useMutation({
      mutationKey: ['addNewStaffs'],
      mutationFn: (params: IAddOrEditStaff) => staffsApi.addNewStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getStaffs']});
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
      mutationFn: (params: IAddOrEditStaff) => staffsApi.updateStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getStaffs']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddOrEditStaff) => {
    setLoading(true);

    if (staffsStore?.singleStaff) {
      updateProcess({
        ...values,
        id: staffsStore?.singleStaff?.id!,
      });

      return;
    }
    addNewStaffs(values);
  };

  const handleModalClose = () => {
    staffsStore.setSingleStaff(null);
    staffsStore.setIsOpenAddEditStaffModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (staffsStore.singleStaff) {
      form.setFieldsValue(staffsStore.singleStaff);
    }
  }, [staffsStore.singleStaff]);

  return (
    <Modal
      open={staffsStore.isOpenAddEditStaffModal}
      title={staffsStore.singleStaff ? 'Xodimni tahrirlash' : 'Xodimni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={staffsStore.singleStaff ? 'Xodimni tahrirlash' : 'Xodimni qo\'shish'}
      cancelText="Bekor qilish"
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
          label="Mijoz"
          rules={[{ required: true }]}
        >
          <Input placeholder="F.I.O" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefon raqami: 901234567"
          rules={[
            { required: true },
            {
              pattern: regexPhoneNumber,
              message: 'Raqamni to\'g\'ri kiriting!, Masalan: 901234567',
            },
          ]}
        >
          <InputNumber
            addonBefore="+998"
            placeholder="Telefon raqami"
            style={{ width: '100%' }}
            type="number"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
