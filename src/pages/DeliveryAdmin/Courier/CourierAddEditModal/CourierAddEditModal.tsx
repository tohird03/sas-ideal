import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {RcFile} from 'antd/es/upload';
import {AxiosResponse} from 'axios';
import {courierApi} from '@/api/courier';
import {imgStages} from '@/api/endpoints';
import {IAddUser, IRoleUserByPermession, IUser} from '@/api/users/types';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {courierStores} from '@/stores/dms';
import {roleStore} from '@/stores/role';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';

export const CourierAddEditModal = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);
  const [roleByUserPer, setRoleByUserPer] = useState<IRoleUserByPermession | null>(null);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: roleByNameData} = useQuery({
    queryKey: ['getRoleByName'],
    queryFn: () => roleStore.getRoleByName({role: 'courier'}),
  });

  const {mutate: addCourier} =
    useMutation({
      mutationKey: ['addCourier'],
      mutationFn: (params: IAddUser) => courierApi.addUserCourier(params),
      onSuccess: (data: AxiosResponse<IUser | null>) => {
        if (data?.data) {
          courierStores.setOldUser(data?.data);
          courierStores.setIsOpenHaveOldUserUpdate(true);

          handleClose();
          setLoading(false);

          return;
        }
        addNotification('Успешно добавлено нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getCouriers']});
        handleClose();
        setLoading(false);
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const {mutate: editCourier} =
    useMutation({
      mutationKey: ['editCourier'],
      mutationFn: (params: IAddUser) => courierApi.editCourier(params),
      onSuccess: (data: AxiosResponse<IUser | null>) => {
        if (data?.data) {
          courierStores.setOldUser(data?.data);
          courierStores.setIsOpenHaveOldUserUpdate(true);

          handleClose();
          setLoading(false);

          return;
        }
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

    if (courierStores.singleCourier) {
      const connectPer = permessions?.filter(newPer => !editOldPer?.includes(newPer));
      const disConnectPer = editOldPer?.filter(newPer => !permessions?.includes(newPer));
      const editUser = {
        ...trimSubmitValues,
        phone: `998${trimSubmitValues?.phone}`,
        avatar: bannerFileList[0]?.thumbUrl!,
        id: courierStores.singleCourier?.userId,
        connectPriviliges: {
          role: [],
          permissions: connectPer,
        },
        disconnectPriviliges: {
          role: [],
          permissions: disConnectPer,
        },
      };

      editCourier(editUser);

      return;
    }

    const addUserParams = {
      ...trimSubmitValues,
      phone: `998${trimSubmitValues?.phone}`,
      priviliges: [{
        role: roleByNameData?.id!,
        permissions: permessions,
      }],
      avatar: bannerFileList[0]?.thumbUrl!,
    };

    addCourier(addUserParams);
  };

  const handleClose = () => {
    courierStores.setSingleCourier(null);
    courierStores.setIsOpenAddEditCourierModal(false);
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

  useEffect(() => {
    if (courierStores.singleCourier) {
      usersStore
        ?.getSingleUser(courierStores.singleCourier?.userId!)
        .then((res) => {
          if (res) {
            form.setFieldsValue(res);
            form.setFieldValue('phone', res?.phone?.slice(3));
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
  }, [courierStores.singleCourier]);

  useEffect(() => {
    if (roleByNameData?.id && courierStores?.singleCourier?.userId) {
      usersStore
        ?.getSingleRoleUserByPermession({userId: courierStores?.singleCourier?.userId!, roleId: roleByNameData?.id!})
        .then(res => {
          if (res) {
            setRoleByUserPer(res);

            setPermessions((res?.assigned || [])?.map(per => per?.id));
            setEditOldPer((res?.assigned || [])?.map(per => per?.id));
          }
        });
    }
  }, [roleByNameData?.id, courierStores?.singleCourier?.userId]);

  return (
    <>
      <Modal
        open={courierStores.isOpenAddEditCourierModal}
        onCancel={handleClose}
        onOk={handleModalOk}
        okText="Создать"
        cancelText="Отмена"
        centered
        title="Добавить пользователя"
        confirmLoading={loading}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '30px'}}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            autoComplete="off"
            style={{width: '100%'}}
          >
            <Form.Item
              label="Изображение"
              rules={[{required: true}]}
            >
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
            {!courierStores.singleCourier &&
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {required: true},
                  notEmptyFieldRules(),
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            }
            <Form.Item
              name="per"
              label="Permession"
              rules={[{required: courierStores?.singleCourier ? false : true}]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {courierStores?.singleCourier && roleByUserPer?.assigned && (
                  roleByNameData?.permissions?.filter(per => per?.status)?.map(per => (
                    <Checkbox
                      key={per?.id}
                      onChange={(e) => handleChangePer(e, per?.id)}
                      defaultChecked={Boolean(roleByUserPer?.assigned?.find(assPer => assPer?.id === per?.id))}
                    >
                      {per?.name}
                    </Checkbox>
                  ))
                )
                }
                {!courierStores?.singleCourier &&
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
        </div>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
});
