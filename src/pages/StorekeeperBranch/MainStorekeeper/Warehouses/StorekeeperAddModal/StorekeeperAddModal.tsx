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
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {RcFile} from 'antd/es/upload';
import {AxiosResponse} from 'axios';
import {imgStages} from '@/api/endpoints';
import {IAddUser, IUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {roleStore} from '@/stores/role';
import {usersStore} from '@/stores/users';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (
  input: string,
  option?: {label: string, value: string}
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddStorekeeperModal = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState<string | null>(null);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: warehouseData, isLoading: warehouseLoading} = useQuery({
    queryKey: ['getWarehouse', warehouseSearch],
    queryFn: () =>
      warehouseStore.getWarehouses({
        name: warehouseSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {data: roleByNameData} = useQuery({
    queryKey: ['getRoleByName'],
    queryFn: () => roleStore.getRoleByName({role: 'storekeeper'}),
  });

  const {data: roleByUserPer} = useQuery({
    queryKey: [
      'getPerByUser',
      mainStorekeeperStore?.singleStorekeeper?.id,
      roleByNameData?.id,
    ],
    queryFn: () =>
      mainStorekeeperStore?.singleStorekeeper?.id && roleByNameData?.id
        ? usersStore?.getSingleRoleUserByPermession({
          userId: mainStorekeeperStore?.singleStorekeeper?.id!,
          roleId: roleByNameData?.id!,
        })
        : null,
  });

  const {mutate: addUserToWarehouse} =
    useMutation({
      mutationKey: ['addUserToWarehouse'],
      mutationFn: (params: IAddUser) => usersApi.addUserToWarehouse(params),
      onSuccess: (data: AxiosResponse<IUser | null>) => {
        if (data?.data) {
          mainStorekeeperStore.setHaveOldUser(data?.data);
          mainStorekeeperStore.setisOpenHaveOldUserError(true);

          handleClose();
          setLoading(false);

          return;
        }
        addNotification('Успешно добавлено нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getAllWarehouse']});
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
    mutationFn: (params: IAddUser) => usersApi.editUserFromWarehouse(params),
    onSuccess: (data: AxiosResponse<IUser | null>) => {
      if (data?.data) {
        mainStorekeeperStore.setisOpenHaveOldUserError(true);
        mainStorekeeperStore.setHaveOldUser(data?.data);

        handleClose();
        setLoading(false);

        return;
      }
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

    if (mainStorekeeperStore.singleStorekeeper) {
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
        id: mainStorekeeperStore.singleStorekeeper?.id,
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

    addUserToWarehouse(addUserParams);
  };

  const handleClose = () => {
    mainStorekeeperStore.setSingleStorekeeper(null);
    mainStorekeeperStore.setIsOpenAddStorekepeerModal(false);
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

  const handleSearchWarehouse = (value: string) => {
    setWarehouseSearch(value);
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

  const warehouseOptions = useMemo(
    () =>
      warehouseData?.warehouseList?.map((warehouse) => ({
        value: warehouse?.id || '',
        label: warehouse?.name,
      })),
    [warehouseData]
  );

  useEffect(() => {
    if (mainStorekeeperStore.singleStorekeeper) {
      usersStore
        ?.getSingleUser(mainStorekeeperStore.singleStorekeeper?.id!)
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
      form.setFieldValue(
        'warehouseId',
        mainStorekeeperStore?.singleStorekeeper?.warehouse
      );
    }
  }, [mainStorekeeperStore.singleStorekeeper]);

  useEffect(() => {
    setPermessions((roleByUserPer?.assigned || [])?.map((per) => per?.id));
    setEditOldPer((roleByUserPer?.assigned || [])?.map((per) => per?.id));
  }, [roleByUserPer?.assigned]);

  return (
    <>
      <Modal
        open={mainStorekeeperStore.isOpenAddStorekeeperModal}
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
              name="warehouseId"
              label="Склад"
              initialValue={mainStorekeeperStore?.updateSingleWarehouse?.id}
            >
              <Select
                placeholder="Склад"
                showSearch
                allowClear
                optionFilterProp="children"
                notFoundContent={
                  warehouseLoading ? <Spin size="small" /> : null
                }
                options={[
                  ...(warehouseOptions || []),
                  ...(mainStorekeeperStore?.updateSingleWarehouse
                    ? [{
                      value: mainStorekeeperStore?.updateSingleWarehouse?.id,
                      label: mainStorekeeperStore?.updateSingleWarehouse?.name,
                    }]
                    : []),
                ]}
                onSearch={handleSearchWarehouse}
                filterOption={filterOption}
                loading={warehouseLoading}
                defaultValue={mainStorekeeperStore?.updateSingleWarehouse?.id}
                className="main-st__product-filter-select"
              />
            </Form.Item>
            {/* <Form.Item
              name="username"
              label="Username"
              rules={[{required: true}]}
            >
              <Input placeholder="Username" />
            </Form.Item> */}
            {!mainStorekeeperStore.singleStorekeeper && (
              <Form.Item
                name="password"
                label="Пароль"
                rules={[{required: true}]}
              >
                <Input.Password placeholder="Пароль" />
              </Form.Item>
            )}
            <Form.Item
              name="per"
              label="Permession"
              rules={[
                {
                  required: mainStorekeeperStore?.singleStorekeeper
                    ? false
                    : true,
                },
              ]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {mainStorekeeperStore?.singleStorekeeper &&
                  roleByUserPer?.assigned &&
                  roleByNameData?.permissions
                    ?.filter((per) => per?.status)
                    ?.map((per) => (
                      <Checkbox
                        key={per?.id}
                        onChange={(e) => handleChangePer(e, per?.id)}
                        defaultChecked={Boolean(
                          roleByUserPer?.assigned?.find(
                            (assPer) => assPer?.id === per?.id
                          )
                        )}
                      >
                        {per?.name}
                      </Checkbox>
                    ))}
                {!mainStorekeeperStore?.singleStorekeeper &&
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

            {/* <Form.Item
              name="rating"
              label="Рейтинг"
              rules={[{required: true}]}
            >
              <InputNumber
                placeholder="Рейтинг"
                type="number"
                maxLength={5}
                addonAfter={<Rate disabled value={rating} />}
                style={{width: "100%"}}
                onChange={handleRatingChange}
              />
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
});
