import React from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal} from 'antd';
import {roleApi} from '@/api/role';
import {IAddRoleParams} from '@/api/role/types';
import {rolesStore} from '@/stores/superAdmin';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddRolesModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {mutate: addRole, isPending: loading} =
    useMutation({
      mutationKey: ['addRole'],
      mutationFn: (params: IAddRoleParams) => roleApi.addRole(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllRoles']});
        handleModalClose();
      },
      onError: addNotification,
    });

  const handleSubmit = (value: IAddRoleParams) => {
    const trimmedObject = trimValues(value);

    addRole(trimmedObject);
  };

  const handleModalClose = () => {
    rolesStore.setIsOpenAddRoles(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  return (
    <Modal
      open={rolesStore.isOpenAddRoles}
      title={'Новый роль'}
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
          label="Имя роли"
          rules={[{required: true}, notEmptyFieldRules()]}
        >
          <Input placeholder="Имя роли" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
