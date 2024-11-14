import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, Modal, Select, Spin} from 'antd';
import {wmsWarehouseApi} from '@/api/wmsWarehouses';
import {IWarehouseAddEdit} from '@/api/wmsWarehouses/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {usersStore} from '@/stores/users';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const WarehouseAddModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchWarehouseType, setSearchWarehouseType] = useState<string | null>(null);

  const {data: getWarehouseTypesData, isLoading: warehouseTypeLoading} = useQuery({
    queryKey: ['getWarehouseType', searchWarehouseType],
    queryFn: () => warehouseStore.getWarehouseTypes({
      pageNumber: 1,
      pageSize: 20,
      name: searchWarehouseType!,
    }),
  });

  const {data: getAllCompaniesData, isLoading: allCompaniesLoading} = useQuery({
    queryKey: ['getAllCompanies'],
    queryFn: () => usersStore.getAllCompanies(),
  });

  const {mutate: addWarehouse} =
    useMutation({
      mutationKey: ['addWarehouse'],
      mutationFn: (params: IWarehouseAddEdit) => wmsWarehouseApi.addNewWarehouse(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllWarehouse']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: editWarehouse} =
    useMutation({
      mutationKey: ['editWarehouse'],
      mutationFn: (params: IWarehouseAddEdit) => wmsWarehouseApi.editWarehouse(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllWarehouse']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalClose = () => {
    mainStorekeeperStore.setIsOpenAddNewWarehouseModal(false);
    mainStorekeeperStore.setUpdateWarehouse(null);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IWarehouseAddEdit) => {
    setLoading(true);
    const trimSubmitValues = trimValues(values);

    if (mainStorekeeperStore.updateSingleWarehouse) {
      editWarehouse({...trimSubmitValues, warehouseId: mainStorekeeperStore.updateSingleWarehouse?.id});

      return;
    }
    addWarehouse(trimSubmitValues);
  };

  const handleSearchWarehouseType = (value: string) => {
    setSearchWarehouseType(value);
  };

  const allComaniesOptions = useMemo(() => (
    getAllCompaniesData?.map((companies => ({
      value: companies?.id,
      label: companies?.name,
    })))
  ), [getAllCompaniesData]);

  const warehouseTypeOptions = useMemo(() => (
    getWarehouseTypesData?.warehouseTypeList?.map((warehouseType => ({
      value: warehouseType?.id,
      label: warehouseType?.name,
    })))
  ), [getWarehouseTypesData]);

  useEffect(() => {
    if (mainStorekeeperStore.updateSingleWarehouse) {
      form.setFieldsValue(mainStorekeeperStore.updateSingleWarehouse);
      form.setFieldValue('warehouseTypeId', mainStorekeeperStore.updateSingleWarehouse?.warehouseType);
    }

    return () => {
      mainStorekeeperStore.setUpdateWarehouse(null);
    };
  }, [mainStorekeeperStore.updateSingleWarehouse]);

  return (
    <Modal
      open={mainStorekeeperStore.isOpenAddNewWarehouseModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      title="Склад"
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
            name="location"
            label="Адрес"
            rules={[{required: true}]}
          >
            <Input placeholder="Адрес" />
          </Form.Item>
          <Form.Item
            name="companyId"
            label="Компания"
            rules={[{required: true}]}
          >
            <Select
              options={allComaniesOptions}
              placeholder="Компания"
              loading={allCompaniesLoading}
            />
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
              notFoundContent={warehouseTypeLoading ? <Spin size="small" /> : null}
              options={warehouseTypeOptions}
              onSearch={handleSearchWarehouseType}
              filterOption={filterOption}
              loading={warehouseTypeLoading}
              className="main-st__product-filter-select"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
});
