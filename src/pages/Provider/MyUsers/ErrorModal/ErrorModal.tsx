import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Checkbox,
  Form,
  List,
  Modal,
  Select,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {AxiosResponse} from 'axios';
import {imgStages} from '@/api/endpoints';
import {IUsersRoles} from '@/api/types';
import {IUser, IUserProviderEdit} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {myUsersStore} from '@/stores/provider';
import {roleStore} from '@/stores/role';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

export const ErrorModal = observer(() => {
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [createUserRoleId, setCreateUserRolesId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: getAllRole} = useQuery({
    queryKey: ['getAllRole'],
    queryFn: () => usersApi.getAllRole(),
  });

  const {data: roleByNameData} = useQuery({
    queryKey: ['getRoleByName', createUserRoleId],
    queryFn: () => createUserRoleId ? roleStore.getRoleByName({role: createUserRoleId}) : null,
  });

  const {mutate: editProviderUser} = useMutation({
    mutationKey: ['editProviderUser'],
    mutationFn: (params: IUserProviderEdit) => usersApi.editProvider(params),
    onSuccess: (data: AxiosResponse<IUser | null>) => {
      if (data?.data) {
        myUsersStore.setHaveErrorSingleUser(data?.data);
        myUsersStore.setIsOpenHaveUserErrorModal(true);

        handleClose();
        setLoading(false);

        return;
      }
      addNotification('Успешное редактирование нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getMyUsers']});
      handleClose();
      setLoading(false);
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (value: IUserProviderEdit) => {
    setLoading(true);
    const trimSubmitValues = trimValues(value);

    const editUser = {
      ...trimSubmitValues,
      id: myUsersStore?.haveErrorSingleUser?.id,
      connectPriviliges: {
        role: [roleByNameData?.id!],
        permissions: permessions,
      },
      disconnectPriviliges: {
        role: [],
        permissions: [],
      },
    };

    editProviderUser(editUser);
  };

  const handleClose = () => {
    myUsersStore.setHaveErrorSingleUser(null);
    myUsersStore.setIsOpenHaveUserErrorModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleOpenForm = () => {
    setIsOpenForm(true);
  };

  const handleRoleChange = (roleName: string) => {
    setCreateUserRolesId(roleName);
  };

  const handleChangePer = (e: CheckboxChangeEvent, perId: string) => {
    if (e?.target?.checked) {
      const findOldAssignPer = permessions?.find(per => per === perId);

      if (!findOldAssignPer) {
        setPermessions([...permessions, perId]);
      }
    } else {
      const findOldAssignPer = permessions?.find(per => per === perId);

      if (findOldAssignPer) {
        const filterPer = permessions?.filter(per => per !== perId);

        setPermessions(filterPer);
      }
    }
  };

  const userCreateRoles = useMemo(() =>
    getAllRole
      ?.filter(roles => roles?.name === IUsersRoles?.ProviderQa || roles?.name === IUsersRoles?.Storekeeper)
      ?.map((roles) => ({
        value: roles?.name,
        label: roles?.name,
      })),
  [getAllRole]);

  return (
    <Modal
      open={myUsersStore.isOpenHaveUserErrorModal}
      onCancel={handleClose}
      onOk={handleModalOk}
      okText="Обновлять"
      cancelText="Отмена"
      centered
      title="Внимание!"
      confirmLoading={loading}
      okButtonProps={{disabled: !isOpenForm}}
    >
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <List>
          <List.Item
            style={
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
              }}
          >
            <Avatar src={`${imgStages?.apiUrl}${myUsersStore?.haveErrorSingleUser?.avatar}`} icon={<UserOutlined />} />
            <div>
              <p>{myUsersStore?.haveErrorSingleUser?.firstName} {myUsersStore?.haveErrorSingleUser?.lastName}</p>
              <p>{myUsersStore?.haveErrorSingleUser?.phone}</p>
            </div>
          </List.Item>
        </List>
        <div>
          <p>Этот пользователь существует в системе</p>
          {!isOpenForm && <Button type="primary" onClick={handleOpenForm}>Добавить роль</Button>}
        </div>
        {isOpenForm &&
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
            style={{width: '100%'}}
          >
            <Form.Item
              name="role"
              label="Роль"
              rules={[{required: true}]}
            >
              <Select
                options={userCreateRoles}
                onChange={handleRoleChange}
              />
            </Form.Item>
            <Form.Item
              label="Складовщик"
              rules={[{required: !myUsersStore?.haveErrorSingleUser}]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {
                  roleByNameData?.permissions?.filter((per: any) => per?.status)?.map(per => (
                    <Checkbox
                      key={per?.id}
                      onChange={(e) => handleChangePer(e, per?.id)}
                    >
                      {per?.name}
                    </Checkbox>
                  ))
                }
              </div>
            </Form.Item>
          </Form>
        }
      </div>
    </Modal>
  );
});
