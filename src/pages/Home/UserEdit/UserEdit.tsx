import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Checkbox, Form,
  Input,
  InputNumber,
  List,
  Modal,
  Rate,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import Table, {ColumnType} from 'antd/es/table';
import {RcFile} from 'antd/es/upload';
import {imgStages} from '@/api/endpoints';
import {IAddUser, IPermession, IRole, IRoleUserByPermession, Privigilas} from '@/api/users/types';
import {ROUTES} from '@/constants';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import {ratingTooltipDesc, UPLOAD_ACCEPT} from '../constants';

type EditUser = {
  params: {
    id: string;
  };
};

const columns: ColumnType<any>[] = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    render: (value) => value,
  },
];

export const UserEdit = observer(() => {
  const {id} = useParams();
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectRowKey, setSelectRowKey] = useState<string | null>(null);
  const [assignRole, setAssignRole] = useState<IRole[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedClickRowKeys, setSelectedClickRowKeys] = useState<React.Key[]>([]);
  const [singleRole, setSingleRole] = useState<IRoleUserByPermession | null>(null);
  const [singleRoleNotUser, setSingleRoleNotUser] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEditOrAdd, setCheckEditOrAdd] = useState<boolean>(false);

  const [priviliges, setPriviliges] = useState<Privigilas>({
    connectPrivigilas: {
      role: [],
      permessions: [],
    },
    disconnectPrivigilas: {
      role: [],
      permessions: [],
    },
  });
  const [rating, setRating] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {data: singleUser} = useQuery({
    queryKey: ['getSingleUser', id],
    queryFn: () => (id ? usersStore?.getSingleUser(id!) : null),
  });

  useEffect(() => {
    if (selectRowKey && singleUser) {
      usersStore?.getSingleRoleUserByPermession({userId: singleUser?.id!, roleId: selectRowKey!})
        .then((res) => {
          setSingleRole(res!);
        })
        .catch(addNotification);
    }

    if (selectRowKey && !singleUser) {
      usersStore?.getSingleRole(selectRowKey).then((res) => {
        setSingleRoleNotUser(res!);
      });
    }
  }, [selectRowKey, selectedClickRowKeys]);

  // FINISHED FORM
  const handleSubmit = async (value: IAddUser) => {
    const roles = assignRole?.map((role) => ({
      permissions: role?.permissions?.map((permession) => permession?.id),
      role: role?.id,
    }));

    setLoading(true);

    if (id) {
      const disconnectCompany: string[] = [];
      const connectCompany: string[] = [];

      await singleUser?.companies?.forEach((oldCompnay) => {
        const dConnect = value?.company?.find((nCompany) => nCompany === oldCompnay?.id);

        if (!dConnect) {
          disconnectCompany.push(oldCompnay?.id);
        }
      });

      await value?.company?.forEach((newCompany) => {
        const connect = singleUser?.companies?.find((oConmpany) => oConmpany?.id === newCompany);

        if (!connect) {
          connectCompany.push(newCompany);
        }
      });

      const trimmedObject = trimValues(value);


      usersStore
        .editUser({
          ...trimmedObject,
          phone: `998${value?.phone}`,
          priviliges,
          connectCompany,
          disconnectCompany,
          id: id!,
          avatar: bannerFileList[0]?.thumbUrl!,
        })
        .then((res) => {
          if (res?.status === 204) {
            queryClient.invalidateQueries({queryKey: ['getUsers']});
            navigate(ROUTES.users);
          }
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    usersStore
      .addUsers({
        ...value,
        phone: `998${value?.phone}`,
        priviliges: roles,
        avatar: bannerFileList[0]?.thumbUrl!,
      })
      .then((res) => {
        if (res?.status === 204) {
          queryClient.invalidateQueries({queryKey: ['getUsers']});
          navigate(ROUTES.users);
        }
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  // IMG
  const handleBeforeUpload = () => false;

  const handleImgChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
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

  const handleRatingChange = (value: number | null) => {
    setRating(value || 0);
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  // ROLE CONTROL FUNCTIONS
  const assignRoleFn = (id: string) => {
    const findAssign = singleUser?.userRoles?.find((el) => el?.id === id);

    if (findAssign) {
      const removeDiscountRole = priviliges?.disconnectPrivigilas?.role?.filter((el) => el !== id);

      setPriviliges({
        ...priviliges,
        disconnectPrivigilas: {
          ...priviliges?.disconnectPrivigilas,
          role: removeDiscountRole,
        },
      });

      return;
    }

    const removeDiscountRole = priviliges?.disconnectPrivigilas?.role?.filter((el) => el !== id);

    setPriviliges({
      connectPrivigilas: {
        ...priviliges?.connectPrivigilas,
        role: [...priviliges.connectPrivigilas.role, id],
      },
      disconnectPrivigilas: {
        ...priviliges?.disconnectPrivigilas,
        role: removeDiscountRole,
      },
    });
  };

  const unAssignRole = (id: string) => {
    const findUnAssign = singleUser?.userRoles?.find((el) => el?.id === id);

    if (findUnAssign) {
      priviliges.disconnectPrivigilas.role?.push(findUnAssign?.id);
    }

    const removeConnectRole = priviliges?.connectPrivigilas?.role?.filter((el) => el !== id);

    setPriviliges({
      ...priviliges,
      connectPrivigilas: {
        ...priviliges?.connectPrivigilas,
        role: removeConnectRole,
      },
    });
  };

  const assignPermession = async (per: IPermession, roleId: string) => {
    const isAssignRolePer = singleUser?.userRoles?.find((role) => role?.id === roleId);

    if (isAssignRolePer) {
      const assignOldPer = await singleRole?.assigned?.find((rolePer) => rolePer?.id === per?.id);

      if (assignOldPer) {
        const removeUnAssignPer =
        priviliges?.disconnectPrivigilas?.permessions?.filter((permession) => permession !== per?.id);

        setPriviliges({
          ...priviliges,
          disconnectPrivigilas: {
            ...priviliges?.disconnectPrivigilas,
            permessions: removeUnAssignPer,
          },
        });

        return;
      }

      const removeUnAssignPer =
        priviliges?.disconnectPrivigilas?.permessions?.filter((permession) => permession !== per?.id);

      setPriviliges({
        ...priviliges,
        disconnectPrivigilas: {
          ...priviliges?.disconnectPrivigilas,
          permessions: removeUnAssignPer,
        },
        connectPrivigilas: {
          ...priviliges?.connectPrivigilas,
          permessions: [...priviliges.connectPrivigilas.permessions, per?.id],
        },
      });
    } else {
      const removeUnAssignPer =
      priviliges?.disconnectPrivigilas?.permessions?.filter((permession) => permession !== per?.id);

      setPriviliges({
        ...priviliges,
        disconnectPrivigilas: {
          ...priviliges?.disconnectPrivigilas,
          permessions: removeUnAssignPer,
        },
        connectPrivigilas: {
          ...priviliges?.connectPrivigilas,
          permessions: [...priviliges.connectPrivigilas.permessions, per?.id],
        },
      });
    }
  };

  const unAssignPermession = async (per: IPermession, roleId: string) => {
    const isAssignRolePer = singleUser?.userRoles?.find((role) => role?.id === roleId);

    if (isAssignRolePer) {
      const assignOldPer = await singleRole?.assigned?.find((rolePer) => rolePer?.id === per?.id);

      const removeUnAssignPer =
      priviliges?.connectPrivigilas?.permessions?.filter((permession) => permession !== per?.id);

      if (assignOldPer) {
        setPriviliges({
          ...priviliges,
          disconnectPrivigilas: {
            ...priviliges?.disconnectPrivigilas,
            permessions: [...priviliges.disconnectPrivigilas.permessions, per?.id],
          },
          connectPrivigilas: {
            ...priviliges?.connectPrivigilas,
            permessions: removeUnAssignPer,
          },
        });

        return;
      }

      setPriviliges({
        ...priviliges,
        connectPrivigilas: {
          ...priviliges?.connectPrivigilas,
          permessions: removeUnAssignPer,
        },
      });
    } else {
      const removeUnAssignPer =
        priviliges?.connectPrivigilas?.permessions?.filter((permession) => permession !== per?.id);

      setPriviliges({
        ...priviliges,
        connectPrivigilas: {
          ...priviliges?.connectPrivigilas,
          permessions: removeUnAssignPer,
        },
      });
    }
  };

  const roleCheckedOpenPer = (key: string) => {
    const findSelectIndex = selectedClickRowKeys.findIndex((el) => el === key);

    const filterOldSelected = selectedRowKeys.filter((el) => el !== key);

    setSelectedRowKeys(filterOldSelected);

    if (findSelectIndex === -1) {
      setSelectedClickRowKeys([...selectedClickRowKeys, key]);
      setSelectRowKey(key);

      // ROLE
      assignRoleFn(key);
    } else {
      const filterSelected = selectedClickRowKeys?.filter((el) => el !== key);

      setSelectedClickRowKeys(filterSelected);

      // ROLE
      unAssignRole(key);
    }
  };

  const handleOpenPermession = (key: string) => {
    roleCheckedOpenPer(key);
  };

  const handleSelectRole = (record: any) => {
    roleCheckedOpenPer(record?.id);
  };

  const rowSelection = {
    selectedRowKeys: [...selectedRowKeys, ...selectedClickRowKeys],
    onSelect: handleSelectRole,
  };

  const handleSubmitUser = () => {
    form.submit();
  };

  const allCompaniesOptions = useMemo(
    () =>
      usersStore?.allCompanies?.map((company) => ({
        value: company?.id,
        label: company?.name,
      })),
    [usersStore?.allCompanies]
  );

  useEffect(() => {
    usersStore.getAllRole();
    usersStore.getAllCompanies();
    setCheckEditOrAdd(false);
    if (id) {
      usersStore?.getSingleUser(id!).then((res) => {
        if (res) {
          const company = res.companies?.map((companies) => companies?.id);

          setCheckEditOrAdd(true);
          form.setFieldsValue(res);
          form.setFieldValue('company', company);
          form.setFieldValue('phone', res?.phone.slice(3));
          setRating(Number(res?.rating));
          setBannerFileList([
            {
              uid: '-1',
              name: 'user.avatar',
              status: 'done',
              url: `${imgStages?.apiUrl}${usersStore.singleUser?.avatar}`,
            },
          ]);
        }
      });
    }

    return () => {
      usersStore.setSingleUser(null);
    };
  }, [id]);

  useEffect(() => {
    if (singleRole) {
      const selectRole = usersStore.allRoles?.map((role) => {
        if (role?.id === selectRowKey) {
          const filterPerRole = {
            ...role,
            permissions:
            [...(singleRole?.assigned?.map((role) =>
              ({...role, status: true})) || []), ...(singleRole?.unassigned?.map((role) =>
              ({...role, status: false})) || [])],
          };

          const filterRole = assignRole.filter((roleFind) => roleFind?.id !== role?.id);

          setAssignRole([...filterRole, filterPerRole]);

          return filterPerRole;
        }

        return role;
      });

      usersStore.setAllRole(selectRole);
    } else if (singleRoleNotUser) {
      const selectRole = usersStore.allRoles?.map((role) => {
        if (role?.id === selectRowKey) {
          const filterPerRole = {
            ...role,
            permissions: singleRoleNotUser?.permissions?.filter((el) => el?.status),
          };

          const filterRole = assignRole.filter((roleFind) => roleFind?.id !== role?.id);

          setAssignRole([
            ...filterRole,
            {
              ...role,
            },
          ]);

          return filterPerRole;
        }

        return role;
      });

      usersStore.setAllRole(selectRole);
    }
  }, [singleRole, singleRoleNotUser]);

  const handleClickRolePermission = (evt: CheckboxChangeEvent, roleChecked: IRole, permissionChecked: IPermession) => {
    if (!evt.target.checked) {
      unAssignPermession(permissionChecked, roleChecked?.id);
      const permessionUnAssign = assignRole?.map((role) => {
        if (role?.id === roleChecked?.id) {
          return {
            ...role,
            permissions: role?.permissions?.filter((permission) => permission?.id !== permissionChecked?.id),
          };
        } else {
          return role;
        }
      });

      setAssignRole(permessionUnAssign);
    } else {
      assignPermession(permissionChecked, roleChecked?.id);
      const permessionUnAssign = assignRole?.map((role) => {
        if (role?.id === roleChecked?.id) {
          return {
            ...role,
            permissions: [...(role.permissions || []), permissionChecked],
          };
        } else {
          return role;
        }
      });

      setAssignRole(permessionUnAssign);
    }
  };

  useEffect(() => {
    if (singleUser) {
      const activeRole = singleUser?.userRoles?.map((role) => role?.id);

      setSelectedRowKeys(activeRole);

      setAssignRole(singleUser?.userRoles);
    }
  }, [singleUser]);

  useEffect(
    () => () => {
      usersStore.setSingleUser(null);
      usersStore.setAllRole([]);
      setSelectRowKey(null);
      setAssignRole([]);
      setSelectedRowKeys([]);
    },
    []
  );

  return (
    <div style={{display: 'flex', justifyContent: 'space-between', gap: '30px'}}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
        style={{maxWidth: '400px', width: '100%'}}
      >
        <Form.Item label="Изображение" rules={[{required: true}]}>
          <Upload
            maxCount={1}
            onPreview={handlePreview}
            beforeUpload={handleBeforeUpload}
            onChange={handleImgChange} fileList={bannerFileList}
            listType="picture-card" accept={UPLOAD_ACCEPT}
          >
            {bannerFileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{marginTop: '8px'}}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="firstName" label="Имя" rules={[{required: true}]}>
          <Input placeholder="Имя" />
        </Form.Item>
        <Form.Item name="lastName" label="Фамилия" rules={[{required: true}]}>
          <Input placeholder="Фамилия" />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={[{required: true}]}>
          <Input placeholder="Username" />
        </Form.Item>
        {!usersStore.singleUser && (
          <Form.Item name="password" label="Password" rules={[{required: true}]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

        )
        }
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
          <InputNumber addonBefore="+998" placeholder="Номер телефона" style={{width: '100%'}} type="number" />
        </Form.Item>
        <Form.Item name="company" label="Компании" rules={[{required: !checkEditOrAdd}]}>
          <Select mode="tags" placeholder="Компании" options={allCompaniesOptions} style={{width: '100%'}} />
        </Form.Item>
        <Form.Item name="rating" label="Рейтинг">
          <InputNumber
            placeholder="Рейтинг"
            type="number"
            maxLength={5}
            addonAfter={<Rate tooltips={ratingTooltipDesc} disabled value={rating} />}
            style={{width: '100%'}}
            onChange={handleRatingChange}
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSubmitUser} type="primary" loading={loading}>
            {usersStore?.singleUser ? 'Обновить пользователя' : 'Добавить нового пользователя'}
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={usersStore.allRoles}
        rowKey="id"
        style={{width: '50%'}}
        pagination={false}
        bordered
        scroll={{y: 600}}
        expandable={{
          expandedRowKeys: selectedClickRowKeys,
          onExpand: (expanded, record) => {
            handleOpenPermession(record?.id);
          },
          expandedRowRender: (record: IRole) => (
            <List
              itemLayout="horizontal"
              dataSource={record?.permissions}
              style={{paddingLeft: '50px'}}
              renderItem={(item) => (
                <List.Item key={item?.id}>
                  <List.Item.Meta
                    avatar={
                      <Checkbox
                        defaultChecked={singleUser?.userRoles?.find((role) =>
                          role?.id === record?.id)
                          ? item?.status
                          : false
                        }
                        onChange={(evt) => handleClickRolePermission(evt, record, item)}
                      />
                    }
                    description={item?.name}
                  />
                </List.Item>
              )}
            />
          ),
        }}
      />

      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </div>
  );
});

export default EditUser;
