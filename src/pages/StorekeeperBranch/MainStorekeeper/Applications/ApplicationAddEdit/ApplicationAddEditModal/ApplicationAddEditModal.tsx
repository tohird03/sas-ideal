import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
} from 'antd';
import {IAddApplication} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';

export const ApplicationAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [warehouseSearch, setWarehouseSearch] = useState<string>('');
  const [applicationType, setApplicationType] = useState<boolean>(false);

  const handleModalClose = () => {
    mainStorekeeperStore.setIsOpneAddApplicationModal(false);
    form.resetFields();
  };

  const {mutate: editApplicationFunc} = useMutation({
    mutationFn: (params: IAddApplication) =>
      mainStorekeeperStore.editApplication(
        mainStorekeeperStore.localApplication?.id || '',
        params
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getByIdApplication'],
      });
      handleModalClose();
      addNotification('Успешно завершено');
    },
    onError: addNotification,
    onSettled: async () => {
      setEditLoading(false);
    },
  });

  const {mutate: postApplicationFunc} = useMutation({
    mutationFn: (params: IAddApplication) =>
      mainStorekeeperStore.postApplications(params),
    onSuccess: (res) => {
      mainStorekeeperStore.setLocalApplication(res);
      queryClient.invalidateQueries({queryKey: ['getAllApplications']});
      handleModalClose();
      addNotification('Успешно завершено');
    },
    onError: addNotification,
    onSettled: async () => {
      setPostLoading(false);
    },
  });

  const {data: warehouseData, isLoading: warehouseLoading} = useQuery({
    queryKey: ['getWarehouse', warehouseSearch],
    queryFn: () =>
      warehouseStore.getWarehouses({
        name: warehouseSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const warehouseOptions = useMemo(
    () =>
      warehouseData?.warehouseList?.map((warehouse) => ({
        value: warehouse?.id || '',
        label: warehouse?.name,
      })),
    [warehouseData]
  );

  const filterOption = (
    input: string,
    option?: {label: string, value: string}
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleSearchWarehouse = (value: string) => {
    setWarehouseSearch(value);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddApplication) => {
    if (
      values?.warehouseId !== mainStorekeeperStore.localApplication?.from?.id
    ) {
      mainStorekeeperStore.setLocalReqProducts([]);
    }

    if (mainStorekeeperStore.localApplication) {
      const warehouseInfo = warehouseData?.warehouseList?.find(
        (el) => el.id === values?.warehouseId
      );

      setEditLoading(true);
      editApplicationFunc({
        ...values,
        clientPhone: `998${values?.clientPhone}`,
      });
      mainStorekeeperStore.setLocalApplication({
        ...mainStorekeeperStore?.localApplication,
        ...(values?.clientName && {clientName: values?.clientName}),
        ...(values?.clientPhone && {
          clientPhone: `998${values?.clientPhone}`,
        }),
        ...(values?.deliveryDate && {deliveryDate: values?.deliveryDate}),
        ...(values?.to && {to: values?.to}),
        ...(values?.warehouseId && {
          from: {
            id: values?.warehouseId,
            name: warehouseInfo?.name || '',
          },
        }),
      });
    } else {
      setPostLoading(true);
      postApplicationFunc({
        ...values,
        clientPhone: `998${values?.clientPhone}`,
      });
    }
  };

  useEffect(() => {
    if (mainStorekeeperStore.localApplication) {
      form.setFieldsValue({
        clientName: mainStorekeeperStore.localApplication?.clientName,
        clientPhone: mainStorekeeperStore.localApplication?.clientPhone.slice(
          3,
          12
        ),
        warehouseId: mainStorekeeperStore.localApplication?.from?.id,
        to: mainStorekeeperStore.localApplication?.to,
      });
    }
  }, [mainStorekeeperStore.isOpneAddApplicationModal]);

  const handleChangeType = (value: string) => {
    if (value === 'c to c') setApplicationType(true);
    else setApplicationType(false);
  };

  return (
    <>
      <Modal
        open={mainStorekeeperStore.isOpneAddApplicationModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        confirmLoading={
          mainStorekeeperStore.localApplication ? editLoading : postLoading
        }
        title={
          mainStorekeeperStore.localApplication
            ? 'Изменить  Заявку '
            : 'Новая заявка'
        }
        centered
        width={'400px'}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
            ]}
            label={'Тип заявки'}
            name="type"
          >
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              options={[
                {label: 'W to C', value: 'w to c'},
                {label: 'W to W', value: 'w to w'},
                {label: 'C to W', value: 'c to w'},
                {label: 'C to C', value: 'c to c'},
              ]}
              className=""
              onChange={handleChangeType}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
            ]}
            label={'Имя получателя'}
            name="clientName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clientPhone"
            label="Номер телефона: 901234567"
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
              {
                validateTrigger: 'onChange',
                pattern: regexPhoneNumber,
                message: 'Неправильный формат телефона, например: 901234567',
              },
            ]}
          >
            <InputNumber
              style={{width: '100%'}}
              addonBefore="+998"
              placeholder="Номер телефона"
              type="number"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
            ]}
            label={'От куда'}
            name="warehouseId"
          >
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              notFoundContent={warehouseLoading ? <Spin size="small" /> : null}
              options={warehouseOptions}
              onSearch={handleSearchWarehouse}
              filterOption={filterOption}
              loading={warehouseLoading}
              className=""
            />
          </Form.Item>
          <Form.Item
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
            ]}
            label={'Куда'}
            name="to"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {required: Boolean(!mainStorekeeperStore.localApplication)},
            ]}
            label={'Когда'}
            name="deliveryDate"
          >
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          {applicationType && (
            <Form.Item label={'Примечание'} name="note">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
});
