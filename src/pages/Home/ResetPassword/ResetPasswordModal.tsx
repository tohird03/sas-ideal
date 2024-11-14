import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Form, Input, Modal} from 'antd';
import {usersStore} from '@/stores/users';

export const ResetPasswordModal = observer(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (value: {password: string}) => {
    setLoading(true);
    usersStore.resetPassword({
      id: usersStore?.singleUser?.id!,
      password: value?.password,
    })
      .then(() => {
        handleModalClose();
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    usersStore.setSingleUser(null);
    usersStore.setIsOpenResetPasswordModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  return (
    <>
      <Modal
        open={usersStore.isOpenResetPasswordModal}
        title={`${usersStore?.singleUser?.firstName} Изменить пароль`}
        onCancel={handleModalClose}
        onOk={handleModalOk}
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
            name="password"
            label="Новый пароль"
            rules={[{required: true}]}
          >
            <Input placeholder="Новый пароль" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
