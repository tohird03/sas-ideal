import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, List, Modal, Select} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import {sellerClientFromApi, sellerClientStatusApi, sellerVisitedClientsApi} from '@/api/seller';
import {IAddVisitedClient, IClient} from '@/api/seller/sellerVisitedClients/types';
import {visitedClientsStore} from '@/stores/seller';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../about-visited-clients.scss';

const cn = classNames.bind(styles);

export const AddVisitedClientModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [searchOtherClients, setSearchOtherClients] = useState<string | null>(null);
  const [isShowNameRecommend, setIsShowNameRecommend] = useState(false);
  const [isShowPhoneRecommend, setIsShowPhoneRecommend] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {mutate: addVisitedClient} =
    useMutation({
      mutationKey: ['addVisitedClient'],
      mutationFn: (params: IAddVisitedClient) => sellerVisitedClientsApi.addVisitedClient(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getVisitedClients']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {data: recommendOtherClients} = useQuery({
    queryKey: [
      'getClients',
      searchOtherClients,
    ],
    queryFn: () => sellerVisitedClientsApi.getClients({
      pageNumber: 1,
      pageSize: 20,
      search: searchOtherClients!,
    }),
  });

  const {data: clientFromData} = useQuery({
    queryKey: ['getClientFrom'],
    queryFn: () => sellerClientFromApi.getClintsFrom({}),
  });

  const {data: clientStatusData} = useQuery({
    queryKey: ['getClientStatus'],
    queryFn: () => sellerClientStatusApi.getClintsStatus({}),
  });

  const handleModalClose = () => {
    visitedClientsStore.setIsOpenAddNewVisitedClient(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (value: IAddVisitedClient) => {
    setLoading(true);
    const trimmedObject = trimValues(value);

    addVisitedClient({
      note: trimmedObject?.note,
      clientFromId: trimmedObject?.clientFromId,
      ...(selectedClientId
        ? {clientId: selectedClientId}
        : {
          name: trimmedObject?.name,
          phone: `+998${trimmedObject?.phone}`,
          address: trimmedObject?.address,
          clientStatusId: trimmedObject?.clientStatusId,
        }),
    });

  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    form.setFieldValue('name', event.currentTarget.value);
    setSearchOtherClients(event.currentTarget.value);
  };

  const handleFocusNameInput = () => {
    setIsShowNameRecommend(true);
  };

  const handleBlurNameInput = () => {
    setTimeout(() => {
      setIsShowNameRecommend(false);
    }, 200);
  };

  const handleSelectClient = (client: IClient) => {
    setSelectedClientId(client?.id);
    form.setFieldsValue({
      name: client.name,
      phone: client.phone.slice(-9),
      clientFromId: client.clientFrom?.id,
    });
    setIsShowNameRecommend(false);
  };

  const handleChangePhone = (value: number | null) => {
    form.setFieldValue('phone', value);
    setSearchOtherClients(value ? String(value) : null);
  };

  const handleFocusPhoneInput = () => {
    setIsShowPhoneRecommend(true);
  };

  const handleBlurPhoneInput = () => {
    setTimeout(() => {
      setIsShowPhoneRecommend(false);
    }, 200);
  };

  const clientFromOptions = useMemo(() => (
    clientFromData?.map(clientFrom => ({
      value: clientFrom?.id,
      label: clientFrom?.name,
    }))
  ), [clientFromData]);

  const clientStatusOptions = useMemo(() => (
    clientStatusData?.map(clienStatus => ({
      value: clienStatus?.id,
      label: clienStatus?.name,
    }))
  ), [clientStatusData]);

  return (
    <Modal
      open={visitedClientsStore.isOpenAddNewVisitedClient}
      title="Новый посетитель"
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
          label="Имя"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input
            placeholder="Имя"
            onChange={handleChangeName}
            onFocus={handleFocusNameInput}
            onBlur={handleBlurNameInput}
            value={form.getFieldValue('name')}
          />
          <div className={cn('name__recommend-wrapper')}>
            {isShowNameRecommend && recommendOtherClients?.clientList?.length! > 0 && (
              <List
                className={cn('name__recommend-list')}
                bordered
                dataSource={recommendOtherClients?.clientList}
                renderItem={visited => (
                  <List.Item
                    className={cn('name__recommend-list-item')}
                    onClick={handleSelectClient.bind(null, visited)}
                  >
                    {visited?.name} - {visited?.phone}
                  </List.Item>
                )}
              />
            )}
          </div>
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
            onChange={handleChangePhone}
            onFocus={handleFocusPhoneInput}
            onBlur={handleBlurPhoneInput}
            value={form.getFieldValue('phone')}
          />
          <div className={cn('name__recommend-wrapper')}>
            {isShowPhoneRecommend && recommendOtherClients?.clientList?.length! > 0 && (
              <List
                className={cn('name__recommend-list')}
                bordered
                dataSource={recommendOtherClients?.clientList}
                renderItem={visited => (
                  <List.Item
                    className={cn('name__recommend-list-item')}
                    onClick={handleSelectClient.bind(null, visited)}
                  >
                    {visited?.name} - {visited?.phone}
                  </List.Item>
                )}
              />
            )}
          </div>
        </Form.Item>
        <Form.Item
          name="clientFromId"
          label="От куда"
          rules={[{required: true}]}
        >
          <Select
            options={clientFromOptions}
            placeholder="От куда"
          />
        </Form.Item>
        {!selectedClientId && (
          <>
            <Form.Item
              name="clientStatusId"
              label="Статус клиента"
              rules={[{required: true}]}
            >
              <Select
                options={clientStatusOptions}
                placeholder="Статус клиента"
              />
            </Form.Item>
            <Form.Item
              name="address"
              label="Адрес"
              rules={[{required: true}]}
            >
              <Input placeholder="Адрес" />
            </Form.Item>
          </>
        )
        }
        <Form.Item
          name="note"
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
