import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
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
import {IAddUser, IPermession, IRole} from '@/api/users/types';
import {ROUTES} from '@/constants';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
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

export const AddUser = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [assignRole, setAssignRole] = useState<IRole[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedClickRowKeys, setSelectedClickRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // FINISHED FORM
  const handleSubmit = (value: IAddUser) => {
    const roles = assignRole?.map((role) => ({
      permissions: role?.permissions?.map((permession) => permession?.id),
      role: role?.id,
    }));

    setLoading(true);

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

  const roleCheckedOpenPer = (key: string) => {
    // GET SINGLE ROLE PERMISSIONS
    usersStore?.getSingleRole(key)
      .then((res) => {
        const selectRole = usersStore.allRoles?.map((role) => {
          if (role?.id === key) {
            const filterPerRole = {
              ...role,
              permissions: res?.permissions?.filter((el) => el?.status)!,
            };

            const findOldCheckRole = assignRole.find((roleFind) => roleFind?.id === role?.id);

            if (findOldCheckRole) {
              const filterRole = assignRole.filter((roleFind) => roleFind?.id !== key);

              setAssignRole(filterRole);
            } else {
              setAssignRole([...assignRole, filterPerRole]);
            }

            return filterPerRole;
          }

          return role;
        });

        usersStore.setAllRole(selectRole);
      });

    // OPEN COLLAPSE OR CLOSE
    const findSelectIndex = selectedClickRowKeys.findIndex((el) => el === key);

    const filterOldSelected = selectedRowKeys.filter((el) => el !== key);

    setSelectedRowKeys(filterOldSelected);

    if (findSelectIndex === -1) {
      setSelectedClickRowKeys([...selectedClickRowKeys, key]);
    } else {
      const filterSelected = selectedClickRowKeys?.filter((el) => el !== key);

      setSelectedClickRowKeys(filterSelected);
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

  // ASSIGN OR UNASSIGN PERMISSION
  const handleClickRolePermission = (evt: CheckboxChangeEvent, roleChecked: IRole, permissionChecked: IPermession) => {
    if (!evt.target.checked) {
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
    usersStore.getAllRole();
    usersStore.getAllCompanies();

    return () => {
      usersStore.setAllRole([]);
      setAssignRole([]);
      setSelectedRowKeys([]);
    };
  }, []);

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
        <Form.Item name="company" label="Компании">
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
                        defaultChecked
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
