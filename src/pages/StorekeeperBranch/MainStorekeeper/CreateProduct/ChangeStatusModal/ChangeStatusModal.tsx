import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select, Spin} from 'antd';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {IAddProductToCard, IWarehouseProductStatus, RandomPartId} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ChangeStatusModal = observer(() => {
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const [statusSearch, setStatusSearch] = useState<string | null>(null);
  const [partId, setpartId] = useState<number | null>(null);
  const [isHavePartId, setIsHavePartId] = useState<boolean>(false);

  const {data: generatinPartId, isLoading: generatinPartIdLoading} = useQuery(
    {
      queryKey: [
        'getPartId',
        mainStorekeeperStore.isOpenChangeStatusCreateProduct,
      ],
      queryFn: () => mainStorekeeperApi.getGenerationPartId(),
    }
  );

  const {mutate: checkPartIdFunc} = useMutation({
    mutationKey: ['checkPartId', partId],
    mutationFn: (params: RandomPartId) =>
      mainStorekeeperApi.checkGenerationPartId(params),
    onSuccess: (res) => {
      setIsHavePartId(res.data?.is_have);
    },
    onError: addNotification,
  });


  const {data: statusListData, isLoading: statusLoading} = useQuery({
    queryKey: ['getWarehouse', statusSearch],
    queryFn: () =>
      mainStorekeeperStore.getProductStatus({
        name: statusSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {mutate: addProductToCard} =
    useMutation({
      mutationKey: ['addProductToCard'],
      mutationFn: (params: IAddProductToCard) => mainStorekeeperApi.addProductToCard(params),
      onSuccess: () => {
        addNotification('Успешное добавление товара в корзину');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setAddLoading(false);
      },
    });

  const handleModalClose = () => {
    mainStorekeeperStore.setSingleCreateProduct(null);
    mainStorekeeperStore.setIsOpenChangeStatusCreateProduct(false);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddProductToCard) => {
    setAddLoading(true);

    addProductToCard({
      ...values,
      partId: `${partId}`,
      pmsProductId: mainStorekeeperStore?.singleCreateProduct?.id!,
    });
  };

  const handleStatusSearch = (value: string) => {
    setStatusSearch(value);
  };

  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
  };

  const statusOptions = useMemo(() => (
    statusListData?.productStatusList
      ?.filter(status =>
        status?.name === IWarehouseProductStatus.ACTIVE ||
        status?.name === IWarehouseProductStatus.DEFECTED)
      ?.map((status) => ({
        value: status?.id || '',
        label: status?.name,
      }))
  ), [statusListData]);

  useEffect(() => {
    if (generatinPartId) {
      form.setFieldValue('partId', generatinPartId?.id);
      setpartId(parseFloat(generatinPartId?.id));
    }

    if (isHavePartId) {
      form.setFields([
        {
          name: 'partId',
          errors: ['ИД товара был создан'],
        },
      ]);
    }
  }, [generatinPartId, partId, isHavePartId]);

  const handleCheckPartId = (value: string | null) => {
    if (value) {
      setpartId(parseFloat(value));
      checkPartIdFunc({
        id: `${value}`,
      });
    }
  };

  return (
    <Modal
      open={mainStorekeeperStore.isOpenChangeStatusCreateProduct}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
      title="В корзинку"
      width={400}
      confirmLoading={addLoading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Статус" name="productStatusId"
          rules={[{required: true}]}
        >
          <Select
            placeholder="Склад"
            showSearch
            allowClear
            optionFilterProp="children"
            notFoundContent={statusLoading ? <Spin size="small" /> : null}
            options={statusOptions}
            onSearch={handleStatusSearch}
            filterOption={filterOption}
            loading={statusLoading}
            className="main-st__product-filter-select"
          />
        </Form.Item>
        <Form.Item
          label={'ИД товара'}
          name="partId"
          style={{width: '100%'}}
          dependencies={['number']}
          rules={[
            {required: true},
            {
              validateTrigger: 'onChange',
              validator: (rule, value) =>
                new Promise<void>((resolve, reject) => {
                  if (value) {
                    if (`${value}`.length < 7) {
                      reject('Не менее 7 цифр');
                    } else {
                      if (isHavePartId) {
                        reject('ИД товара был создан');
                      } else {
                        resolve();
                      }
                    }
                  } else {
                    resolve();
                  }
                }),
            },
          ]}
        >
          <InputNumber
            disabled={generatinPartIdLoading}
            placeholder={`${1234567}`}
            style={{width: '100%'}}
            parser={parser}
            onChange={handleCheckPartId}
          />
        </Form.Item>
        <Form.Item
          label={'Сколько'}
          rules={[{required: true}]}
          name="quantity"
          initialValue={mainStorekeeperStore?.singleCreateProduct?.quantity!}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="10 шт"
            defaultValue={mainStorekeeperStore?.singleCreateProduct?.quantity!}
            max={mainStorekeeperStore?.singleCreateProduct?.quantity}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
