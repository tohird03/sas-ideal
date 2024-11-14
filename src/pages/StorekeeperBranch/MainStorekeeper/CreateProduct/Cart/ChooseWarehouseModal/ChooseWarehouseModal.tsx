import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Modal, Select, Spin} from 'antd';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {IAddProductToWarhouse} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ChooseWarehouseModal = observer(() => {
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [warehouseSearch, setWarehouseSearch] = useState<string | null>(null);

  const {data: warehouseData, isLoading: warehouseLoading} = useQuery({
    queryKey: ['getWarehouse', warehouseSearch],
    queryFn: () =>
      warehouseStore.getWarehouses({
        name: warehouseSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {mutate: addProductByMainSt} =
    useMutation({
      mutationKey: ['addProductByMainSt'],
      mutationFn: (warehouseId: string) => mainStorekeeperApi.createProduct(warehouseId),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCartProductList']});
        addNotification('Успешное добавление продукта');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setAddLoading(false);
      },
    });

  const handleModalClose = () => {
    mainStorekeeperStore.setIsOpenCartChooseWarehouseModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddProductToWarhouse) => {
    setAddLoading(true);
    addProductByMainSt(values?.warehouseId);
  };

  const handleSearchWarehouse = (value: string) => {
    setWarehouseSearch(value);
  };

  const warehouseOptions = useMemo(() => (
    warehouseData?.warehouseList?.map((warehouse) => ({
      value: warehouse?.id || '',
      label: warehouse?.name,
    }))
  ), [warehouseData]);

  return (
    <Modal
      open={mainStorekeeperStore.isOpenCartChooseWarehouseModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
      title="Выбрать склад"
      width={400}
      confirmLoading={addLoading}
      okText="Создать товар на этом складе"
      cancelText="Отмена"
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Склад"
          rules={[{required: true}]}
          name="warehouseId"
        >
          <Select
            placeholder="Склад"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={warehouseLoading ? <Spin size="small" /> : null}
            options={warehouseOptions}
            onSearch={handleSearchWarehouse}
            filterOption={filterOption}
            loading={warehouseLoading}
            className="main-st__product-filter-select"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
