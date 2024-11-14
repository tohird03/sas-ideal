import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select, Skeleton} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {cashboxApi} from '@/api/cashbox';
import {paymentApi} from '@/api/payment';
import {IPaymentCreate, IPaymentRequestType} from '@/api/payment/types';
import {cashboxStore} from '@/stores/cashier';
import {processStore} from '@/stores/process';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const SpendMoneyModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchCashbox, setSearchCashbox] = useState<string | null>(null);

  const {mutate: paymentToCashbox} =
    useMutation({
      mutationKey: ['paymentToCashbox'],
      mutationFn: (params: IPaymentCreate) => paymentApi.addPayment(params),
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

  const handleSubmit = (value: IPaymentCreate) => {
    setLoading(true);
    const trimmedObject = trimValues(value);

    paymentToCashbox({
      ...trimmedObject,
      contactPhone: `998${trimmedObject?.contactPhone}`,
      type: IPaymentRequestType.Expense,
    });
  };

  const handleModalClose = () => {
    processStore.setSingleProcess(null);
    cashboxStore.setIsOpenSpendMoneyModal(false);
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
      open={cashboxStore.isOpenSpendMoneyModal}
      title={'Расход'}
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
          name="cashboxId"
          label="С кассы"
          rules={[{required: true}]}
        >
          <Select
            style={{minWidth: '100%'}}
            options={cashboxOptions}
            placeholder="С кассы"
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
          name="contactName"
          label="Имя получателья"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input
            placeholder="Имя получателья"
          />
        </Form.Item>
        <Form.Item
          name="contactPhone"
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
