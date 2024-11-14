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
  Skeleton,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {RcFile} from 'antd/es/upload';
import {AxiosResponse} from 'axios';
import {cashboxApi} from '@/api/cashbox';
import {cashierApi} from '@/api/cashier';
import {IAddEditCashier, ICashier} from '@/api/cashier/types';
import {imgStages} from '@/api/endpoints';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {cashierUserStore} from '@/stores/cashier';
import {roleStore} from '@/stores/role';
import {usersStore} from '@/stores/users';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (
  input: string,
  option?: {label: string, value: string}
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditCashier = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [permessions, setPermessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOldPer, setEditOldPer] = useState<string[]>([]);
  const [searchCashbox, setSearchCashbox] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const {data: cashboxData, isLoading: cashboxLoading} = useQuery({
    queryKey: ['getCashboxData', searchCashbox],
    queryFn: () =>
      cashboxApi.getCashbox({
        pageNumber: 1,
        pageSize: 100,
        name: searchCashbox!,
      }),
  });

  const {data: roleByNameData} = useQuery({
    queryKey: ['getRoleByName'],
    queryFn: () => roleStore.getRoleByName({role: 'cashier'}),
  });

  const {data: roleByUserPer} = useQuery({
    queryKey: [
      'getPerByUser',
      cashierUserStore?.singleCashier?.id,
      roleByNameData?.id,
    ],
    queryFn: () =>
      cashierUserStore?.singleCashier?.id && roleByNameData?.id
        ? usersStore?.getSingleRoleUserByPermession({
          userId: cashierUserStore?.singleCashier?.id!,
          roleId: roleByNameData?.id!,
        })
        : null,
  });

  const {mutate: addCashier} =
    useMutation({
      mutationKey: ['addCashier'],
      mutationFn: (params: IAddEditCashier) => cashierApi.addCashier(params),
      onSuccess: (data: AxiosResponse<ICashier | null>) => {
        if (data?.data) {
          cashierUserStore.setIsHaveSingleUser(data?.data);
          cashierUserStore.setIsOpenWhileAddUserIsHaveUserErrorModal(true);

          handleClose();
          setLoading(false);

          return;
        }
        addNotification('Успешно добавлено нового пользователя');
        queryClient.invalidateQueries({queryKey: ['getCashier']});
        handleClose();
        setLoading(false);
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const {mutate: editCashbox} = useMutation({
    mutationKey: ['editCashbox'],
    mutationFn: (params: IAddEditCashier) => cashierApi.editCashier(params),
    onSuccess: (data: AxiosResponse<ICashier | null>) => {
      if (data?.data) {
        cashierUserStore.setIsHaveSingleUser(data?.data);
        cashierUserStore.setIsOpenWhileAddUserIsHaveUserErrorModal(true);

        handleClose();
        setLoading(false);

        return;
      }
      addNotification('Успешное редактирование нового пользователя');
      queryClient.invalidateQueries({queryKey: ['getCashier']});
      handleClose();
      setLoading(false);
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (value: IAddEditCashier) => {
    setLoading(true);
    const trimSubmitValues = trimValues(value);

    if (cashierUserStore?.singleCashier) {
      const connectPer = permessions?.filter(
        (newPer) => !editOldPer?.includes(newPer)
      );
      const disConnectPer = editOldPer?.filter(
        (newPer) => !permessions?.includes(newPer)
      );
      const editUser = {
        ...trimSubmitValues,
        username: value?.username!,
        phone: `998${trimSubmitValues?.phone}`,
        avatar: bannerFileList[0]?.thumbUrl!,
        cashboxIds: [value?.cashboxIds],
        id: cashierUserStore?.singleCashier?.id,
        connectPriviliges: {
          role: [],
          permissions: connectPer,
        },
        disconnectPriviliges: {
          role: [],
          permissions: disConnectPer,
        },
      };

      editCashbox(editUser);

      return;
    }

    const addUserParams = {
      ...trimSubmitValues,
      phone: `998${trimSubmitValues?.phone}`,
      cashboxIds: [value?.cashboxIds],
      priviliges: [
        {
          role: roleByNameData?.id!,
          permissions: permessions,
        },
      ],
      avatar: bannerFileList[0]?.thumbUrl!,
    };

    addCashier(addUserParams);
  };

  const handleClose = () => {
    cashierUserStore.setSingleCashier(null);
    cashierUserStore.setIsOpenAddEditCashierModal(false);
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

  const handleSearchCashbox = (value: string) => {
    setSearchCashbox(value);
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

  const cashboxOptions = useMemo(() => (
    cashboxData?.cashboxList?.map(cashbox => ({
      value: cashbox?.id,
      label: cashbox?.name,
    }))
  ), [cashboxData]);

  useEffect(() => {
    if (cashierUserStore?.singleCashier) {
      usersStore
        ?.getSingleUser(cashierUserStore?.singleCashier?.id!)
        .then((res) => {
          if (res) {
            form.setFieldsValue(res);
            form.setFieldValue('phone', res?.phone?.slice(3));
            form.setFieldValue('cashboxIds', cashierUserStore?.singleCashier?.cashboxs[0]?.id);
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
        cashierUserStore?.singleCashier
      );
    }
  }, [cashierUserStore?.singleCashier]);

  useEffect(() => {
    setPermessions((roleByUserPer?.assigned || [])?.map((per) => per?.id));
    setEditOldPer((roleByUserPer?.assigned || [])?.map((per) => per?.id));
  }, [roleByUserPer?.assigned]);

  return (
    <>
      <Modal
        open={cashierUserStore.isOpenAddEditCashierModal}
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
              name="cashboxIds"
              label="Касса"
              rules={[{required: true}]}
            >
              <Select
                style={{minWidth: '100%'}}
                options={cashboxOptions}
                placeholder="Касса"
                showSearch
                allowClear
                optionFilterProp="children"
                notFoundContent={cashboxLoading ? <Skeleton /> : null}
                onSearch={handleSearchCashbox}
                filterOption={filterOption}
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
            {!cashierUserStore?.singleCashier && (
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
              rules={[{required: !cashierUserStore?.singleCashier}]}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {cashierUserStore?.singleCashier &&
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
                {!cashierUserStore?.singleCashier &&
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
