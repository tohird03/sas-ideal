import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select, Spin} from 'antd';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {
  IAddProductToCard,
  IWarehouseProductStatus,
} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

const filterOption = (
  input: string,
  option?: {label: string, value: string}
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ChangeStatusModal = observer(() => {
  const [addLoading, setAddLoading] = useState(false);
  const [statusSearch, setStatusSearch] = useState<string | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {data: statusListData, isLoading: statusLoading} = useQuery({
    queryKey: ['getWarehouse', statusSearch],
    queryFn: () =>
      mainStorekeeperStore.getProductStatus({
        name: statusSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {mutate: editCartProductStatus} = useMutation({
    mutationKey: ['editCartProductStatus'],
    mutationFn: (params: IAddProductToCard) =>
      mainStorekeeperApi.editCardProductStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getCartProductList']});
      addNotification('Статус успешного изменения');
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setAddLoading(false);
    },
  });

  const handleModalClose = () => {
    mainStorekeeperStore.setSingleCartProduct(null);
    mainStorekeeperStore.setIsOpenChangeStatusCartProduct(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddProductToCard) => {
    setAddLoading(true);
    editCartProductStatus({
      ...values,
      pmsProductId: mainStorekeeperStore?.singleCartProduct?.cartId!,
    });
  };

  const handleStatusSearch = (value: string) => {
    setStatusSearch(value);
  };

  const statusOptions = useMemo(
    () =>
      statusListData?.productStatusList
        ?.filter(
          (status) =>
            status?.name === IWarehouseProductStatus.ACTIVE ||
            status?.name === IWarehouseProductStatus.DEFECTED
        )
        ?.map((status) => ({
          value: status?.id || '',
          label: status?.name,
        })),
    [statusListData]
  );

  const parser = (value: string | undefined) => {
    if (!value || isNaN(Number(value))) {
      return '';
    }

    return value.replace(/[^\d.]/g, '');
  };

  return (
    <Modal
      open={mainStorekeeperStore.isOpenChangeStatusCartProduct}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
      title="Изменить статус"
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
          label="Статус"
          rules={[{required: true}]}
          name="productStatusId"
          initialValue={
            mainStorekeeperStore?.singleCartProduct?.productStatus?.id!
          }
        >
          <Select
            placeholder="Статус"
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
          label={'Изменить ИД'}
          name="partId"
          style={{width: '100%'}}
          dependencies={['number']}
          rules={[
            {
              validateTrigger: 'onChange',
              validator: (rule, value) =>
                new Promise<void>((resolve, reject) => {
                  if (value) {
                    if (`${value}`.length < 7) {
                      reject('Не менее 7 цифр');
                    } else {
                      resolve();
                    }
                  } else {
                    resolve();
                  }
                }),
            },
          ]}
        >
          <InputNumber
            placeholder={'1234567'}
            style={{width: '100%'}}
            parser={parser}
          />
        </Form.Item>
        <Form.Item
          label="Изменить из 10"
          rules={[{required: true}]}
          name="quantity"
          initialValue={mainStorekeeperStore?.singleCartProduct?.quantity!}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="10 шт"
            defaultValue={mainStorekeeperStore?.singleCartProduct?.quantity!}
            max={mainStorekeeperStore?.singleCartProduct?.quantity}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
