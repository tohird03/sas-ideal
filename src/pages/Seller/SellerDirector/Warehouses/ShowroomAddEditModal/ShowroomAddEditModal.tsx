import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {UserOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Avatar, Form, Input, Modal, Select, Skeleton, Typography} from 'antd';
import {imgStages} from '@/api/endpoints';
import {showroomApi} from '@/api/showroom';
import {IAddNewShowroom} from '@/api/showroom/types';
import {usersApi} from '@/api/users/users';
import {requestStore} from '@/stores/dms';
import {sellerShowroomsStore} from '@/stores/seller';
import {addNotification} from '@/utils';

const filterOption = (input: string, option?: {label: React.ReactElement, value: string, optionLabelProp: string}) =>
  (option?.optionLabelProp ?? '').toLowerCase().includes(input.toLowerCase());

export const AddShowroomModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchSeller, setsearchSeller] = useState<string | null>(null);

  const {data: sellersData, isLoading: getSellersLoading} = useQuery({
    queryKey: [
      'getSellers',
      searchSeller,
    ],
    queryFn: () => usersApi.getUsersByRole({
      pageNumber: 1,
      pageSize: 1000,
      flag: 'seller',
    }),
  });

  const {mutate: addNewShowroom} =
    useMutation({
      mutationKey: ['addNewShowroom'],
      mutationFn: (params: IAddNewShowroom) => showroomApi.addNewShowroom(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllShowrooms']});
        handleClose();
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const {mutate: updateShowroom} =
    useMutation({
      mutationKey: ['updateShowroom'],
      mutationFn: (params: IAddNewShowroom) => showroomApi.updateShowroom(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllShowrooms']});
        handleClose();
      },
      onError: addNotification,
      onSettled: () => {
        setLoading(false);
      },
    });

  const handleSubmit = (value: IAddNewShowroom) => {
    setLoading(true);

    if (sellerShowroomsStore.singleShowroom) {
      updateShowroom({
        ...value,
        showroomId: sellerShowroomsStore?.singleShowroom?.id,
      });

      return;
    }

    addNewShowroom(value);
  };

  const handleClose = () => {
    sellerShowroomsStore.setSingleShowroom(null);
    sellerShowroomsStore.setIsOpenAddEditShowroomModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleCourierSearch = (value: string) => {
    setsearchSeller(value);
  };

  const sellerOptions = useMemo(() => (
    [
      ...(sellersData?.userList || []),
    ]?.map(courier => ({
      value: courier?.id,
      optionLabelProp: `${courier?.firstName} ${courier?.lastName}`,
      label: (
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <Avatar src={`${imgStages?.apiUrl}${courier?.avatar}`} icon={<UserOutlined />} />
          <div>
            <Typography.Title
              level={5}
              style={{margin: '0'}}
            >
              {courier?.firstName}
              {courier?.lastName}
            </Typography.Title>
            <Typography.Paragraph
              style={{margin: '0'}}
            >
                +{courier?.phone}
            </Typography.Paragraph>
          </div>
        </div>
      ),
    }))
  ), [sellersData]);

  useEffect(() => {
    if (sellerShowroomsStore.singleShowroom) {
      form.setFieldsValue(sellerShowroomsStore.singleShowroom);
    }
  }, [sellerShowroomsStore.singleShowroom]);

  return (
    <>
      <Modal
        open={sellerShowroomsStore.isOpenAddEditShowroomModal}
        onCancel={handleClose}
        onOk={handleModalOk}
        okText="Создать"
        cancelText="Отмена"
        centered
        title="Добавить шоурумы"
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
              name="name"
              label="Имя"
              rules={[{required: true}]}
            >
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Адрес"
              rules={[{required: true}]}
            >
              <Input placeholder="Адрес" />
            </Form.Item>
            <Form.Item
              name="sellerId"
              label="Продавец"
              rules={[{required: true}]}
              style={{minWidth: '250px', height: '50px'}}
              className="create-flight__info-courierChoose"
            >
              <Select
                style={{minWidth: '250px', height: '50px'}}
                options={sellerOptions}
                placeholder="Курьер"
                showSearch
                allowClear
                defaultValue={requestStore?.singleFlightCourier?.id}
                optionFilterProp="children"
                notFoundContent={getSellersLoading ? <Skeleton /> : null}
                onSearch={handleCourierSearch}
                filterOption={filterOption}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
});
