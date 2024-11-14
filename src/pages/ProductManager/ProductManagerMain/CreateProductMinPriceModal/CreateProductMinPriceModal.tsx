import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal, Select, Spin,
} from 'antd';
import {ColumnType} from 'antd/es/table';
import {expenseTypeApi} from '@/api/expenseType/expenseType';
import {IProductMinPrice} from '@/api/productmanager/tyes';
import {DataTable} from '@/components/Datatable/datatable';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {useMediaQuery} from '@/utils/mediaQuery';
import {priceFormat} from '@/utils/priceFormat';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const CreateProductMinPriceModal = observer(() => {
  const [searchSpendName, setSearchSpendName] = useState<string | null>(null);
  const [activeSpendName, setActiveSpendName] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [form] = Form.useForm();

  const {data: expenseTypeData, isLoading: expenseLoading} = useQuery({
    queryKey: [
      'getExpenseType',
      searchSpendName,
    ],
    queryFn: () =>
      expenseTypeApi.getExpenseType({
        pageNumber: 1,
        pageSize: 20,
        name: searchSpendName!,
      }),
  });

  const handleModalClose = () => {
    productManagerStore.setIsOpenCreateProductMinPriceModal(false);
  };

  const handleSubmitProductMinPriceSpends = (values: IProductMinPrice) => {
    const newMinPriceSpend: IProductMinPrice = {
      id: productManagerStore.createAddEditProductMinPriceSpends[productManagerStore.createAddEditProductMinPriceSpends?.length - 1]?.id + 1 || 1,
      spendTypeId: values.spendTypeId,
      description: values.description,
      spend: values.spend,
      spendTypeName: activeSpendName!,
    };

    const updateMinPriceSpends = [...productManagerStore.createAddEditProductMinPriceSpends, newMinPriceSpend];
    const minPrice = updateMinPriceSpends?.reduce((acc, current) => acc + current?.spend, 0);

    productManagerStore.setCreateAddEditProductMinPriceSpends(updateMinPriceSpends);
    productManagerStore.setCreateProductMinPrice(minPrice);
    form.resetFields();
  };

  const handleChangeExpense = (value: string) => {
    const findSpendType = expenseTypeData?.spendTypeList?.find(spend => spend?.id === value);

    setActiveSpendName(findSpendType?.name!);
  };

  const handleSearchExpense = (value: string) => {
    setSearchSpendName(value);
  };

  const handleAddMinPriceSpend = () => {
    form.submit();
  };

  const handleDeleteMinPriceSpend = (productMinPriceSpend: IProductMinPrice) => {
    const updateMinPriceSpends =
      productManagerStore.createAddEditProductMinPriceSpends?.filter(spend => spend?.id !== productMinPriceSpend?.id);
    const minPrice = updateMinPriceSpends?.reduce((acc, current) => acc + current?.spend, 0);

    productManagerStore.setCreateAddEditProductMinPriceSpends(updateMinPriceSpends);
    productManagerStore.setCreateProductMinPrice(minPrice);
  };

  const expenseOptions = useMemo(() => (
    expenseTypeData?.spendTypeList?.map((expense) => ({
      value: expense?.id || '',
      label: expense?.name,
    }))
  ), [expenseTypeData]);

  const minPriceColumns: ColumnType<IProductMinPrice>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'spendType',
      dataIndex: 'spendType',
      title: 'Категория',
      align: 'center',
      render: (value, record) => (
        <Select
          options={[{value: record?.spendTypeId, label: record?.spendTypeName}]}
          defaultValue={record?.spendTypeId}
          disabled
        />
      ),
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Примечание',
      align: 'center',
      render: (value, record) => record?.description,
    },
    {
      key: 'spend',
      dataIndex: 'spend',
      title: 'Минимальный расход',
      align: 'center',
      render: (value, record) => priceFormat(record?.spend),
    },
    {
      key: 'delete',
      dataIndex: 'delete',
      title: 'Удалить',
      align: 'center',
      render: (value, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={handleDeleteMinPriceSpend.bind(null, record)}
          danger
        />
      ),
    },
  ];

  return (
    <Modal
      open={productManagerStore.isOpenCreateProductMinPriceModal}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      centered
      okText="Создать"
      cancelText="Отмена"
      title={`Минимальный расход: ${priceFormat(productManagerStore.createProductMinPrice)} сум`}
      width={900}
    >
      <div>
        <Form
          form={form}
          onFinish={handleSubmitProductMinPriceSpends}
          layout="vertical"
          autoComplete="off"
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 250px 250px auto',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Form.Item
            label="Категория"
            rules={[{required: true}]}
            name="spendTypeId"
          >
            <Select
              placeholder="Категория"
              showSearch
              allowClear
              optionFilterProp="children"
              notFoundContent={expenseLoading ? <Spin size="small" /> : null}
              options={expenseOptions}
              onChange={handleChangeExpense}
              onSearch={handleSearchExpense}
              filterOption={filterOption}
              loading={expenseLoading}
              className="main-st__product-filter-select"
            />
          </Form.Item>
          <Form.Item
            label="Примечание"
            rules={[{required: true}]}
            name="description"
          >
            <Input placeholder="Примечание" />
          </Form.Item>
          <Form.Item
            label="Минимальный расход"
            rules={[{required: true}]}
            name="spend"
          >
            <InputNumber
              style={{width: '200px'}}
              formatter={(value) => priceFormat(value!)}
              placeholder="Минимальный расход"
            />
          </Form.Item>
          <Button
            onClick={handleAddMinPriceSpend}
            type="primary"
          >
          Добавлять
          </Button>
        </Form>
      </div>

      <DataTable
        columns={minPriceColumns}
        data={productManagerStore.createAddEditProductMinPriceSpends}
        isMobile={isMobile}
        pagination={false}
      />
    </Modal>
  );
});
