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
import {showroomApi} from '@/api/showroom';
import {IAddUser, IRole, IRoleUserByPermession, IUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {sellerShowroomsStore} from '@/stores/seller';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddStorekeeperModal = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [singleRole, setSingleRole] = useState<IRole | null>(null);
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);
  const [roleByUserPer, setRoleByUserPer] = useState<IRoleUserByPermession | null>(null);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: showroomsData} = useQuery({
    queryKey: ['getAllShowroom'],
    queryFn: () => showroomApi.getAllShowroom(),
  });

  const {mutate: addUserToShowroom} =
    useMutation({
      mutationKey: ['addUserToShowroom'],
      mutationFn: (params: IAddUser) => usersApi.addUserToShowroom(params),
      onSuccess: (data: AxiosResponse<IUser | null>) => {
        if (data?.data) {
          sellerShowroomsStore.setWhileAddUserHaveOldUser(data?.data);
          sellerShowroomsStore.setIsOpenHaveUserErrorModal(true);

          handleClose();
          setLoading(false);

          return;
        }
        addNotification('Успешно добавлено нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getAllShowrooms']});
        handleClose();
        setLoading(false);
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const {mutate: editUserFromWarehouse} = useMutation({
    mutationKey: ['editUserFromWarehouse'],
    mutationFn: (params: IAddUser) => usersApi.editUserToShowroom(params),
    onSuccess: (data: AxiosResponse<IUser | null>) => {
      if (data?.data) {
        sellerShowroomsStore.setWhileAddUserHaveOldUser(data?.data);
        sellerShowroomsStore.setIsOpenHaveUserErrorModal(true);

        handleClose();
        setLoading(false);

        return;
      }
      addNotification('Успешное редактирование нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getAllShowrooms']});
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

    if (sellerShowroomsStore?.singleSeller) {
      const connectPer = permessions?.filter(
        (newPer) => !editOldPer?.includes(newPer)
      );
      const disConnectPer = editOldPer?.filter(
        (newPer) => !permessions?.includes(newPer)
      );
      const editUser = {
        ...trimSubmitValues,
        phone: `998${trimSubmitValues?.phone}`,
        avatar: bannerFileList[0]?.thumbUrl!,
        id: sellerShowroomsStore?.singleSeller?.id,
        connectPriviliges: {
          role: [],
          permissions: connectPer,
        },
        disconnectPriviliges: {
          role: [],
          permissions: disConnectPer,
        },
      };

      editUserFromWarehouse(editUser);

      return;
    }

    const addUserParams = {
      ...value,
      phone: `998${value?.phone}`,
      priviliges: [{
        role: singleRole?.id!,
        permissions: permessions,
      }],
      avatar: bannerFileList[0]?.thumbUrl!,
    };

    addUserToShowroom(addUserParams);
  };

  const handleClose = () => {
    sellerShowroomsStore.setSingleUser(null);
    sellerShowroomsStore.setSingleShowroom(null);
    sellerShowroomsStore.setIsOpenAddEditSellerModal(false);
  };

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

  const handleModalOk = () => {
    form.submit();
  };

  const handleRoleChange = async (value: string) => {
    if (value) {
      const userRoles = await usersApi.getSingleRoleByUserByPermession({
        userId: sellerShowroomsStore?.singleSeller?.id!,
        roleId: value,
      });

      setRoleByUserPer(userRoles);
      setPermessions((userRoles?.assigned || [])?.map((per) => per?.id));
      setEditOldPer((userRoles?.assigned || [])?.map((per) => per?.id));

      usersStore?.getSingleRole(value)
        .then((res) => {
          setSingleRole({
            ...res!,
            permissions: res?.permissions?.filter(status => status?.status)!,
          });
        })
        .catch(addNotification);
    }
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

  const showroomOptions = useMemo(() => (
    showroomsData?.map(showroom => ({
      value: showroom?.id,
      label: showroom?.name,
    }))
  ), [showroomsData]);

  useEffect(() => {
    if (sellerShowroomsStore?.singleSeller) {
      usersStore
        ?.getSingleUser(sellerShowroomsStore?.singleSeller?.id!)
        .then((res) => {
          if (res) {
            const sellerOrMainSellerRole = res?.userRoles?.find(role => role?.name === 'seller' || role?.name === 'main-seller');

            form.setFieldsValue(res);
            form.setFieldValue('phone', res?.phone?.slice(3));
            form.setFieldValue('role', sellerOrMainSellerRole?.id);
            form.setFieldValue('showroomId', sellerShowroomsStore?.singleSeller?.showroom?.id);
            setSingleRole(sellerOrMainSellerRole!);
            handleRoleChange(sellerOrMainSellerRole?.id!);
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
    }
  }, [sellerShowroomsStore?.singleSeller]);

  const OnlySellerRoles = usersStore?.allRoles
    ?.filter(role => (role?.name === 'seller' || role?.name === 'main-seller'))
    ?.map((role => ({
      value: role?.id,
      label: role?.name,
    })));

  useEffect(() => {
    form.setFieldValue('showroomId', sellerShowroomsStore?.singleShowroom?.id);
    usersStore.getAllRole();
  }, []);

  return (
    <>
      <Modal
        open={sellerShowroomsStore.isOpenAddEditSellerModal}
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
              rules={[{required: true}]}
            >
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[{required: true}]}
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
              name="showroomId"
              label="Шоурум"
              rules={[{required: true}]}
            >
              <Select
                options={showroomOptions}
                placeholder="Шоурум"
              />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{required: true}]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            {!sellerShowroomsStore?.singleSeller && (
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
              label="Роли"
              rules={[{required: true}]}
            >
              <Select
                placeholder="Роли"
                options={OnlySellerRoles}
                onChange={handleRoleChange}
                disabled={Boolean(sellerShowroomsStore?.singleSeller)}
              />
            </Form.Item>

            <Form.Item
              name="per"
              label="Permession"
              rules={[{required: permessions?.length === 0}]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {singleRole?.permissions?.map(per => (
                  <Checkbox
                    key={per?.id}
                    onChange={(e) => handleChangePer(e, per?.id)}
                    defaultChecked={roleByUserPer?.assigned?.findIndex(assPer => assPer?.id === per?.id) !== -1}
                  >
                    {per?.name}
                  </Checkbox>
                ))
                }
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
