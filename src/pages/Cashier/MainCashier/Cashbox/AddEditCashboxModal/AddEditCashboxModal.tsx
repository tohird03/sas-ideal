import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal, Select, Skeleton} from 'antd';
import {cashboxApi} from '@/api/cashbox';
import {IAddEditCashbox} from '@/api/cashbox/types';
import {cashierApi} from '@/api/cashier';
import {showroomApi} from '@/api/showroom';
import {cashboxStore} from '@/stores/cashier';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const AddEditCashboxModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchCashier, setSearchCashier] = useState<string | null>(null);

  const {mutate: addCashbox} =
    useMutation({
      mutationKey: ['addCashbox'],
      mutationFn: (params: IAddEditCashbox) => cashboxApi.addCashbox(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCashbox']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateCashbox} =
    useMutation({
      mutationKey: ['updateCashbox'],
      mutationFn: (params: IAddEditCashbox) => cashboxApi.updateCashbox(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCashbox']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {data: cashiersData, isLoading: cashierLoading} = useQuery({
    queryKey: ['getCashiers', searchCashier],
    queryFn: () =>
      cashierApi.getCashier({
        pageNumber: 1,
        pageSize: 100,
        search: searchCashier!,
      }),
  });

  const {data: showroomsData} = useQuery({
    queryKey: ['getAllShowroom'],
    queryFn: () => showroomApi.getAllShowroom(),
  });

  const handleSubmit = (value: IAddEditCashbox) => {
    setLoading(true);
    const trimmedObject = trimValues(value);


    if (cashboxStore?.singleCashbox) {
      updateCashbox({
        ...trimmedObject,
        id: cashboxStore?.singleCashbox?.id,
      });

      return;
    }
    addCashbox(trimmedObject);
  };

  const handleModalClose = () => {
    cashboxStore.setSingleCashbox(null);
    cashboxStore.setIsOpenAddEditCashboxModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSearchCashier = (value: string) => {
    setSearchCashier(value);
  };

  const showroomOptions = useMemo(() => (
    showroomsData?.map(showroom => ({
      value: showroom?.id,
      label: showroom?.name,
    }))
  ), [showroomsData]);

  const cashierOptions = useMemo(() => (
    [
      cashboxStore?.singleCashbox?.cashier!,
      ...(cashiersData?.userList || []),
    ].map(cashier => ({
      value: cashier?.id,
      label: `${cashier?.firstName || ''} ${cashier?.lastName || ''}`,
    }))
  ), [cashiersData]);

  useEffect(() => {
    if (cashboxStore?.singleCashbox) {
      form.setFieldsValue({
        ...cashboxStore?.singleCashbox,
        sources: cashboxStore?.singleCashbox?.sources?.map(source => source?.id),
        cashierId: cashboxStore?.singleCashbox?.cashier?.id,
      });
    }
  }, [cashboxStore?.singleCashbox]);

  return (
    <Modal
      open={cashboxStore.isOpenAddEditCashboxModal}
      title={cashboxStore?.singleCashbox ? 'Изменить касса' : 'Новый касса'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Наименование"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Наименование" />
        </Form.Item>
        <Form.Item
          name="cashierId"
          label="Кассир"
          rules={[{required: true}]}
        >
          <Select
            style={{minWidth: '100%'}}
            options={cashierOptions}
            placeholder="Кассир"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={cashierLoading ? <Skeleton /> : null}
            onSearch={handleSearchCashier}
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="sources"
          label="Источники"
          rules={[{required: true}]}
        >
          <Select
            options={showroomOptions}
            placeholder="Источники"
            mode="multiple"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
