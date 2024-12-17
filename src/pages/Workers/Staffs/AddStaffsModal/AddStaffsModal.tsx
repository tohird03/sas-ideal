import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Collapse, Form, Input, InputNumber, Modal } from 'antd';
import { IAddOrEditStaff, staffsApi } from '@/api/staffs';
import { staffsStore } from '@/stores/workers';
import { addNotification } from '@/utils';
import { regexPhoneNumber } from '@/utils/phoneFormat';
import { roleApi } from '@/api/role';

export const AddStaffsModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: roleData, isLoading: loadingRole } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => roleApi.getAllRoles(),
  });

  const { mutate: addNewStaffs } =
    useMutation({
      mutationKey: ['addNewStaffs'],
      mutationFn: (params: IAddOrEditStaff) => staffsApi.addNewStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const { mutate: updateProcess } =
    useMutation({
      mutationKey: ['updateProcess'],
      mutationFn: (params: IAddOrEditStaff) => staffsApi.updateStaff(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getStaffs'] });
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
      form.setFieldsValue({
        ...staffsStore.singleStaff,
        phone: staffsStore.singleStaff?.phone?.slice(3),
      });
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
          label="Xodim"
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
      {roleData?.data?.map(role => (
        <div key={role?.id}>
          <Collapse
            size="small"
            items={[{
              key: role?.id,
              label: role?.name,
              children: <p>{role?.permissions[0]?.name}</p>,
            }]}
          />
        </div>
      ))
      }
    </Modal>
  );
});
