import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select, Skeleton} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {cashboxApi} from '@/api/cashbox';
import {ITransferMoneyFromCashboxParams} from '@/api/cashbox/types';
import {cashboxStore} from '@/stores/cashier';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const TransferMoneyModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchCashbox, setSearchCashbox] = useState<string | null>(null);

  const {mutate: transferMoneyFromCashbox} =
    useMutation({
      mutationKey: ['transferMoneyFromCashbox'],
      mutationFn: (params: ITransferMoneyFromCashboxParams) => cashboxApi.transferMoney(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getCashbox']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {data: cashboxData, isLoading: cashboxLoading} = useQuery({
    queryKey: ['getCashboxData', searchCashbox],
    queryFn: () =>
      cashboxApi.getCashbox({
        pageNumber: 1,
        pageSize: 100,
        name: searchCashbox!,
      }),
  });

  const handleSubmit = (value: ITransferMoneyFromCashboxParams) => {
    setLoading(true);
    const trimmedObject = trimValues(value);

    transferMoneyFromCashbox({
      ...trimmedObject,
      fromCashboxId: cashboxStore?.singleCashbox?.id!,
    });
  };

  const handleModalClose = () => {
    cashboxStore.setSingleCashbox(null);
    cashboxStore.setIsOpenTransferModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSearchCashier = (value: string) => {
    setSearchCashbox(value);
  };

  const cashboxOptions = useMemo(() => (
    cashboxData?.cashboxList?.map(cashbox => ({
      value: cashbox?.id,
      label: cashbox?.name,
    }))
  ), [cashboxData]);

  return (
    <Modal
      open={cashboxStore.isOpenTransferMoneyModal}
      title={'Оплатить'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Сохранить"
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
          name="toCashboxId"
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
            onSearch={handleSearchCashier}
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="sum"
          label="Сумма"
          rules={[{required: true}]}
        >
          <InputNumber
            style={{minWidth: '100%'}}
            formatter={(value) => priceFormat(value!)}
            placeholder="Сумма"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Примечание"
          rules={[{required: true}]}
        >
          <TextArea
            placeholder="Примечание"
            autoSize={{minRows: 4, maxRows: 6}}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
