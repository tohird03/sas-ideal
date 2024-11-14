import React, {useState} from 'react';
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
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {imgStages} from '@/api/endpoints';
import {IAddUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {roleStore} from '@/stores/role';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

export const ErrorModal = observer(() => {
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: roleByNameData} = useQuery({
    queryKey: ['getRoleByName'],
    queryFn: () => roleStore.getRoleByName({role: 'storekeeper'}),
  });

  const {mutate: editUserFromWarehouse} =
    useMutation({
      mutationKey: ['editUserFromWarehouse'],
      mutationFn: (params: IAddUser) => usersApi.editUserFromWarehouse(params),
      onSuccess: () => {
        addNotification('Успешное редактирование нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getAllWarehouse']});
        handleClose();
        setLoading(false);
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddUser) => {
    setLoading(true);
    const trimSubmitValues = trimValues(value);

    const editUser = {
      ...trimSubmitValues,
      id: mainStorekeeperStore?.isHaveOldUser?.id,
      connectPriviliges: {
        role: [roleByNameData?.id],
        permissions: permessions,
      },
      disconnectPriviliges: {
        role: [],
        permissions: [],
      },
    };

    editUserFromWarehouse(editUser);
  };

  const handleClose = () => {
    mainStorekeeperStore.setHaveOldUser(null);
    mainStorekeeperStore.setisOpenHaveOldUserError(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleOpenForm = () => {
    setIsOpenForm(true);
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

  return (
    <Modal
      open={mainStorekeeperStore.isOpenHaveOldUserError}
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
            <Avatar src={`${imgStages?.apiUrl}${mainStorekeeperStore?.isHaveOldUser?.avatar}`} icon={<UserOutlined />} />
            <div>
              <p>{mainStorekeeperStore?.isHaveOldUser?.firstName} {mainStorekeeperStore?.isHaveOldUser?.lastName}</p>
              <p>{mainStorekeeperStore?.isHaveOldUser?.phone}</p>
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
              label="Складовщик"
              rules={[{required: mainStorekeeperStore?.singleStorekeeper ? false : true}]}
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
