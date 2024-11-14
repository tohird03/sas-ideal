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
import {courierApi} from '@/api/courier';
import {imgStages} from '@/api/endpoints';
import {IAddUser} from '@/api/users/types';
import {courierStores} from '@/stores/dms';
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
    queryFn: () => roleStore.getRoleByName({role: 'courier'}),
  });

  const {mutate: editCourier} =
    useMutation({
      mutationKey: ['editCourier'],
      mutationFn: (params: IAddUser) => courierApi.editCourier(params),
      onSuccess: () => {
        addNotification('Успешное редактирование нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getCouriers']});
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
      id: courierStores?.oldUser?.id,
      connectPriviliges: {
        role: [roleByNameData?.id],
        permissions: permessions,
      },
      disconnectPriviliges: {
        role: [],
        permissions: [],
      },
    };

    editCourier(editUser);
  };

  const handleClose = () => {
    courierStores.setOldUser(null);
    courierStores.setIsOpenHaveOldUserUpdate(false);
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
      open={courierStores.isOpenHaveOldUserUpdate}
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
              }}
          >
            <Avatar src={`${imgStages?.apiUrl}${courierStores?.oldUser?.avatar}`} icon={<UserOutlined />} />
            <div>
              <p>{courierStores?.oldUser?.firstName} {courierStores?.oldUser?.lastName}</p>
              <p>{courierStores?.oldUser?.phone}</p>
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
              label="Курьер"
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
