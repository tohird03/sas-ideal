import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {RcFile} from 'antd/es/upload';
import {AxiosResponse} from 'axios';
import {imgStages} from '@/api/endpoints';
import {IAddUser, IUser, IUserProviderEdit} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {pmProviderStore} from '@/stores/productManager';
import {roleStore} from '@/stores/role';
import {usersStore} from '@/stores/users';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import {IAddEditProviderForm} from '../types';

const filterOption = (
  input: string,
  option?: {label: string, value: string}
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditProvider = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState<string | null>(null);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);
  const [haveWarehouseThisProvider, setHaveWarehouseThisProvider] = useState(
    pmProviderStore?.singleProvider?.warehouse?.myWarehouse || false
  );
  const [searchWarehouseType, setSearchWarehouseType] = useState<string | null>(
    null
  );
  const [checkAll, setCheckAll] = useState<boolean>(false);

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

  const {data: getWarehouseTypesData, isLoading: warehouseTypeLoading} =
    useQuery({
      queryKey: ['getWarehouseType', searchWarehouseType],
      queryFn: () =>
        warehouseStore.getWarehouseTypes({
          pageNumber: 1,
          pageSize: 100,
          name: searchWarehouseType!,
        }),
    });

  const {data: roleByNameData, isPending: roleByNameDataLoading} = useQuery({
    queryKey: ['getRoleByName', pmProviderStore?.singleProvider],
    queryFn: () => roleStore.getRoleByName({role: 'provider'}),
  });

  const {data: roleByUserPer} = useQuery({
    queryKey: [
      'getPerByUser',
      pmProviderStore?.singleProvider?.id,
      roleByNameData?.id,
    ],
    queryFn: () =>
      pmProviderStore?.singleProvider?.id && roleByNameData?.id
        ? usersStore?.getSingleRoleUserByPermession({
          userId: pmProviderStore?.singleProvider?.id!,
          roleId: roleByNameData?.id!,
        })
        : null,
  });

  const {mutate: addProviderUser} = useMutation({
    mutationKey: ['addProviderUser'],
    mutationFn: (params: IAddUser) => usersApi.addProvider(params),
    onSuccess: (data) => {
      if (data?.data) {
        pmProviderStore.setIsHaveSingleUser(data?.data);
        pmProviderStore.setWhileAddUserIsHaveUserError(true);

        handleClose();
        setLoading(false);

        return;
      }
      addNotification('Успешно добавлено нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getManagerProvider']});
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
        pmProviderStore.setIsHaveSingleUser(data?.data);
        pmProviderStore.setWhileAddUserIsHaveUserError(true);

        handleClose();
        setLoading(false);

        return;
      }
      addNotification('Успешное редактирование нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getManagerProvider']});
      handleClose();
      setLoading(false);
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });

  const allPermissions =
    roleByNameData?.permissions?.filter((per) => per?.status) || [];

  const handleSubmit = (value: IAddEditProviderForm) => {
    setLoading(true);
    let trimSubmitValues = trimValues(value);

    if (haveWarehouseThisProvider) {
      trimSubmitValues = {
        ...trimSubmitValues,
        companyName: value?.companyName,
        warehouse: {
          name: value?.warehouseName,
          location: value?.location,
          warehouseTypeId: value?.warehouseTypeId,
        },
      };
    }

    if (pmProviderStore?.singleProvider) {
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
        userId: pmProviderStore.singleProvider?.id,
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
    pmProviderStore.setSingleProvider(null);
    pmProviderStore.setIsOpenAddEditProviderModal(false);
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

  const handleChangeHaveWarehouse = (checked: boolean) => {
    setHaveWarehouseThisProvider(checked);
  };

  const handleSearchWarehouseType = (value: string) => {
    setSearchWarehouseType(value);
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

  const warehouseTypeOptions = useMemo(
    () =>
      getWarehouseTypesData?.warehouseTypeList?.map((warehouseType) => ({
        value: warehouseType?.id,
        label: warehouseType?.name,
      })),
    [getWarehouseTypesData]
  );

  useEffect(() => {
    if (pmProviderStore.singleProvider) {
      usersStore
        ?.getSingleUser(pmProviderStore.singleProvider?.id!)
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

      if (pmProviderStore?.singleProvider?.warehouse?.myWarehouse) {
        form.setFieldsValue({
          warehouseName: pmProviderStore?.singleProvider?.warehouse?.name,
          location: pmProviderStore?.singleProvider?.warehouse?.location,
          companyName: pmProviderStore?.singleProvider?.company?.name,
          warehouseTypeId:
            pmProviderStore?.singleProvider?.warehouse?.warehouseType?.id,
        });
      } else {
        form.setFieldValue(
          'warehouseId',
          pmProviderStore?.singleProvider?.warehouse?.id
        );
      }
    }
  }, [pmProviderStore?.singleProvider]);

  useEffect(() => {
    setPermessions((roleByUserPer?.assigned || [])?.map((per) => per?.id));
    setEditOldPer((roleByUserPer?.assigned || [])?.map((per) => per?.id));
  }, [roleByUserPer?.assigned]);

  const handleCheckAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      const allChecked = allPermissions?.map((per) => per.id);

      setPermessions(allChecked);
      setCheckAll(true);
    } else {
      setPermessions([]);
      setCheckAll(false);
    }
  };

  return (
    <>
      <Modal
        open={pmProviderStore.isOpenAddEditProviderModal}
        onCancel={handleClose}
        onOk={handleModalOk}
        okText="Создать"
        cancelText="Отмена"
        centered
        width={800}
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
            <Row gutter={24}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <div
                  style={{display: 'flex', alignItems: 'center', gap: '15px'}}
                >
                  Есть свой скдад
                  <Switch
                    defaultChecked={haveWarehouseThisProvider}
                    onChange={handleChangeHaveWarehouse}
                  />
                </div>
                {haveWarehouseThisProvider ? (
                  <>
                    <Form.Item
                      name="warehouseName"
                      label="Название склада"
                      rules={[{required: true}, notEmptyFieldRules()]}
                    >
                      <Input placeholder="Название склада" />
                    </Form.Item>
                    <Form.Item
                      name="location"
                      label="Адрес"
                      rules={[{required: true}, notEmptyFieldRules()]}
                    >
                      <Input placeholder="Адрес" />
                    </Form.Item>
                    <Form.Item
                      name="companyName"
                      label="Компания"
                      rules={[{required: true}, notEmptyFieldRules()]}
                    >
                      <Input placeholder="Компания" />
                    </Form.Item>
                    <Form.Item
                      name="warehouseTypeId"
                      label="Category"
                      rules={[{required: true}]}
                    >
                      <Select
                        placeholder="Склад"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        notFoundContent={
                          warehouseTypeLoading ? <Spin size="small" /> : null
                        }
                        options={warehouseTypeOptions}
                        onSearch={handleSearchWarehouseType}
                        filterOption={filterOption}
                        loading={warehouseTypeLoading}
                        className="main-st__product-filter-select"
                      />
                    </Form.Item>
                  </>
                ) : (
                  <Form.Item
                    name="warehouseId"
                    label="Склад"
                    initialValue={
                      pmProviderStore?.singleProvider?.warehouse?.id
                    }
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
                        ...(pmProviderStore?.singleProvider?.warehouse
                          ? [
                            {
                              value:
                                  pmProviderStore?.singleProvider?.warehouse
                                    ?.id,
                              label:
                                  pmProviderStore?.singleProvider?.warehouse
                                    ?.name,
                            },
                          ]
                          : []),
                      ]}
                      onSearch={handleSearchWarehouse}
                      filterOption={filterOption}
                      loading={warehouseLoading}
                      defaultValue={
                        pmProviderStore?.singleProvider?.warehouse?.id
                      }
                      className="main-st__product-filter-select"
                    />
                  </Form.Item>
                )}
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
                  rules={[{required: true}, notEmptyFieldRules()]}
                >
                  <Input placeholder="Имя" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Фамилия"
                  rules={[{required: true}, notEmptyFieldRules()]}
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
                      message:
                        'Неправильный формат телефона, например: 901234567',
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
                  rules={[{required: true}, notEmptyFieldRules()]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
                {!pmProviderStore.singleProvider && (
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
                  rules={[{required: !pmProviderStore?.singleProvider}]}
                >
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    {!roleByNameDataLoading && (
                      <Checkbox onChange={handleCheckAll} checked={checkAll}>
                        <b>Выбрать все</b>
                      </Checkbox>
                    )}
                    {pmProviderStore?.singleProvider &&
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
                            checked={permessions.includes(per?.id)}
                          >
                            {per?.name}
                          </Checkbox>
                        ))}
                    {!pmProviderStore?.singleProvider &&
                      roleByNameData?.permissions
                        ?.filter((per: any) => per?.status)
                        ?.map((per) => (
                          <Checkbox
                            key={per?.id}
                            checked={permessions.includes(per?.id)}
                            onChange={(e) => handleChangePer(e, per?.id)}
                          >
                            {per?.name}
                          </Checkbox>
                        ))}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
});
