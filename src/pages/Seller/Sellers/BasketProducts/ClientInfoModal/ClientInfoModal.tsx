import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {ArrowRightOutlined, ClearOutlined, CloseOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Select} from 'antd';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import {useLocalStorage} from 'usehooks-ts';
import {sellerClientFromApi, sellerClientStatusApi, sellerVisitedClientsApi} from '@/api/seller';
import {ISellerSaleClient} from '@/api/seller/sellerSaleAndOrder/types';
import {IClient} from '@/api/seller/sellerVisitedClients/types';
import {sellerStore} from '@/stores/seller';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import styles from '../bascket-products.scss';

const cn = classNames.bind(styles);

export const ClientInfoModal = observer(() => {
  const [form] = Form.useForm();
  const [searchOtherClients, setSearchOtherClients] = useState<string | null>(null);
  const [isShowNameRecommend, setIsShowNameRecommend] = useState(false);
  const [isShowPhoneRecommend, setIsShowPhoneRecommend] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [sellerClientLocal, setSellerClientLocal] = useLocalStorage<ISellerSaleClient | null>('sellerClientLocal', null);

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

  const {data: clientFromData, isLoading: clientFromLoading} = useQuery({
    queryKey: ['getClientFrom'],
    queryFn: () => sellerClientFromApi.getClintsFrom({}),
  });

  const {data: clientStatusData, isLoading: clientStatusLoading} = useQuery({
    queryKey: ['getClientStatus'],
    queryFn: () => sellerClientStatusApi.getClintsStatus({}),
  });

  const handleModalClose = () => {
    sellerStore.setIsOpenSellerClentInfoModal(false);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: ISellerSaleClient) => {
    const thisClientFrom = clientFromData?.find(from => from?.id === values?.clientFromId);

    let saleClient = {...values, clientFrom: thisClientFrom!};

    if (selectedClientId) {
      saleClient = {...saleClient, clientId: selectedClientId};
    }

    setSellerClientLocal(saleClient);
    sellerStore.setIsOpenSellerClentInfoModal(false);
    sellerStore.setIsOpenSellerPaymentModal(true);
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
      clientStatusId: client?.clientStatus?.id,
      address: client?.address,
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

  const handleClearForm = () => {
    setSelectedClientId(null);
    setSellerClientLocal(null);
    form.resetFields();
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

  useEffect(() => {
    if (sellerClientLocal) {
      form.setFieldsValue({
        ...sellerClientLocal,
        deliveryDate: dayjs(sellerClientLocal?.deliveryDate, 'YYYY-MM-DD'),
      });

      if (sellerClientLocal?.clientId) {
        setSelectedClientId(sellerClientLocal?.clientId);
      }
    }
  }, [sellerClientLocal]);

  return (
    <>
      <Modal
        open={sellerStore.isOpenSellerClentInfoModal}
        onOk={handleModalOk}
        onCancel={handleModalClose}
        title="О клиенте"
        centered
        width={'500px'}
        okText="Сохранить"
        cancelText="Отмена"
        footer={
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Button
              onClick={handleClearForm}
              icon={<ClearOutlined />}
              type="primary"
              danger
            >
              Clear
            </Button>
            <Button
              onClick={handleModalClose}
              icon={<CloseOutlined />}
            >
              Отмена
            </Button>
            <Button
              onClick={handleModalOk}
              icon={<ArrowRightOutlined />}
              type="primary"
              disabled={clientFromLoading || clientStatusLoading}
            >
              Следующий
            </Button>
          </div>
        }
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
              disabled={!!selectedClientId}
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
              disabled={!!selectedClientId}
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
              disabled={!!selectedClientId}
            />
          </Form.Item>
          <Form.Item
            name="clientStatusId"
            label="Статус клиента"
            rules={[{required: true}]}
          >
            <Select
              options={clientStatusOptions}
              placeholder="Статус клиента"
              disabled={!!selectedClientId}
            />
          </Form.Item>
          <Form.Item
            label="дд. мм. гггг"
            name="deliveryDate"
            style={{width: '100%'}}
            rules={[{required: true}]}
          >
            <DatePicker
              placeholder="дд. мм. гггг"
              style={{width: '100%'}}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Адрес"
            rules={[{required: true}]}
          >
            <Input
              placeholder="Адрес"
              disabled={!!selectedClientId}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
