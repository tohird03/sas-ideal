import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {RcFile} from 'antd/es/upload';
import {AxiosResponse} from 'axios';
import {imgStages} from '@/api/endpoints';
import {IUsersRoles} from '@/api/types';
import {IAddUser, IRoleUserByPermession, IUser, IUserProviderEdit} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {myUsersStore} from '@/stores/provider';
import {roleStore} from '@/stores/role';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditProvider = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);
  const [createUserRoleId, setCreateUserRolesId] = useState<string | null>(null);
  const [roleByUserPer, setRoleByUserPer] = useState<IRoleUserByPermession | null>(null);

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

  const {mutate: addProviderUser} =
    useMutation({
      mutationKey: ['addProviderUser'],
      mutationFn: (params: IAddUser) => usersApi.addProviderUsers(params),
      onSuccess: (data: AxiosResponse<IUser | null>) => {
        if (data?.data) {
          myUsersStore.setHaveErrorSingleUser(data?.data);
          myUsersStore.setIsOpenHaveUserErrorModal(true);

          handleClose();
          setLoading(false);

          return;
        }
        addNotification('Успешно добавлено нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getMyUsers']});
        handleClose();
        setLoading(false);
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
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

  const handleSubmit = (value: IAddUser) => {
    setLoading(true);
    const trimSubmitValues = trimValues(value);

    if (myUsersStore.singleUser) {
      const connectPer = permessions?.filter(
        (newPer) => !editOldPer?.includes(newPer)
      );
      const disConnectPer = editOldPer?.filter(
        (newPer) => !permessions?.includes(newPer)
      );
      const editUser: IUserProviderEdit = {
        ...trimSubmitValues,
        username: value?.username!,
        phone: `998${trimSubmitValues?.phone}`,
        avatar: bannerFileList[0]?.thumbUrl!,
        userId: myUsersStore.singleUser?.id,
        connectPriviliges: {
          role: [],
          permissions: connectPer,
        },
        disconnectPriviliges: {
          role: [],
          permissions: disConnectPer,
        },
      };

      editProviderUser(editUser);

      return;
    }

    const addUserParams = {
      ...trimSubmitValues,
      phone: `998${trimSubmitValues?.phone}`,
      priviliges: [
        {
          role: roleByNameData?.id!,
          permissions: permessions,
        },
      ],
      avatar: bannerFileList[0]?.thumbUrl!,
    };

    addProviderUser(addUserParams);
  };

  const handleClose = () => {
    myUsersStore.setSingleUser(null);
    myUsersStore.setIsOpenAddEditUserModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };


  // IMG
  const handleBeforeUpload = () => false;

  const handleImgChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setBannerFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();

        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();

    setPreviewImage(src);
    setPreviewOpen(true);
    image.src = src;
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handleRoleChange = (roleName: string) => {
    setCreateUserRolesId(roleName);
  };

  const handleChangePer = (e: CheckboxChangeEvent, perId: string) => {
    if (e?.target?.checked) {
      const findOldAssignPer = permessions?.find((per) => per === perId);

      if (!findOldAssignPer) {
        setPermessions([...permessions, perId]);
      }
    } else {
      const findOldAssignPer = permessions?.find((per) => per === perId);

      if (findOldAssignPer) {
        const filterPer = permessions?.filter((per) => per !== perId);

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

  useEffect(() => {
    if (myUsersStore.singleUser) {
      usersStore
        ?.getSingleUser(myUsersStore.singleUser?.id!)
        .then((res) => {
          if (res) {
            const findUserRoleName = res?.userRoles
              ?.find(roles =>
                roles?.name === IUsersRoles?.ProviderQa
              || roles?.name === IUsersRoles?.Storekeeper)
              ?.name!;

            form.setFieldsValue(res);
            form.setFieldValue('phone', res?.phone?.slice(3));
            form.setFieldValue('role', findUserRoleName);
            setCreateUserRolesId(findUserRoleName);

            setBannerFileList([
              {
                uid: '-1',
                name: 'user.avatar',
                status: 'done',
                url: `${imgStages?.apiUrl}${usersStore.singleUser?.avatar}`,
              },
            ]);
          }
        })
        .catch(addNotification);
      form.setFieldValue('warehouseId', myUsersStore?.singleUser);
    }
  }, [myUsersStore?.singleUser]);

  useEffect(() => {
    if (roleByNameData?.id && myUsersStore.singleUser?.id) {
      usersStore
        ?.getSingleRoleUserByPermession({userId: myUsersStore.singleUser?.id!, roleId: roleByNameData?.id!})
        .then(res => {
          if (res) {
            setRoleByUserPer(res);

            setPermessions((res?.assigned || [])?.map(per => per?.id));
            setEditOldPer((res?.assigned || [])?.map(per => per?.id));
          }
        });
    }
  }, [roleByNameData?.id, myUsersStore.singleUser?.id]);

  return (
    <>
      <Modal
        open={myUsersStore.isOpenAddEditUserModal}
        onCancel={handleClose}
        onOk={handleModalOk}
        okText="Создать"
        cancelText="Отмена"
        centered
        title="Добавить пользователя"
        confirmLoading={loading}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '30px',
          }}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
            style={{width: '100%'}}
          >
            <Form.Item label="Изображение" rules={[{required: true}]}>
              <Upload
                maxCount={1}
                onPreview={handlePreview}
                beforeUpload={handleBeforeUpload}
                onChange={handleImgChange}
                fileList={bannerFileList}
                listType="picture-card"
                accept={UPLOAD_ACCEPT}
              >
                {bannerFileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{marginTop: '8px'}}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="firstName"
              label="Имя"
              rules={[
                {required: true},
                notEmptyFieldRules(),
              ]}
            >
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[
                {required: true},
                notEmptyFieldRules(),
              ]}
            >
              <Input placeholder="Фамилия" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Номер телефона: 901234567"
              rules={[
                {required: true},
                {
                  pattern: regexPhoneNumber,
                  message: 'Неправильный формат телефона, например: 901234567',
                },
              ]}
            >
              <InputNumber
                addonBefore="+998"
                placeholder="Номер телефона"
                style={{width: '100%'}}
                type="number"
              />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {required: true},
                notEmptyFieldRules(),
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            {!myUsersStore.singleUser && (
              <Form.Item
                name="password"
                label="Пароль"
                rules={[{required: true}]}
              >
                <Input.Password placeholder="Пароль" />
              </Form.Item>
            )}
            <Form.Item
              name="role"
              label="Роль"
              rules={[{required: true}]}
            >
              <Select
                disabled={!!myUsersStore?.singleUser?.id}
                options={userCreateRoles}
                onChange={handleRoleChange}
                defaultValue={createUserRoleId}
                placeholder="Роль"
              />
            </Form.Item>
            <Form.Item
              name="per"
              label="Permession"
              rules={[{required: !myUsersStore?.singleUser}]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {myUsersStore?.singleUser &&
                  roleByUserPer?.assigned &&
                  roleByNameData?.permissions
                    ?.filter((per) => per?.status)
                    ?.map((per) => (
                      <Checkbox
                        key={per?.id}
                        onChange={(e) => handleChangePer(e, per?.id)}
                        defaultChecked={Boolean(
                          roleByUserPer?.assigned?.find(
                            (assPer: any) => assPer?.id === per?.id
                          )
                        )}
                      >
                        {per?.name}
                      </Checkbox>
                    ))}
                {!myUsersStore?.singleUser &&
                  roleByNameData?.permissions
                    ?.filter((per: any) => per?.status)
                    ?.map((per) => (
                      <Checkbox
                        key={per?.id}
                        onChange={(e) => handleChangePer(e, per?.id)}
                      >
                        {per?.name}
                      </Checkbox>
                    ))}
              </div>
            </Form.Item>

          </Form>
        </div>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
});
