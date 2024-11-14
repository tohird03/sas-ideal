import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, InputNumber, Modal, Select, Spin} from 'antd';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {IAddProductToCard} from '@/api/mainStorekeeper/types';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

const filterOption = (
  input: string,
  option?: {label: string, value: string}
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ChangeStatusModal = observer(() => {
  const [form] = Form.useForm();
  const [addLoading, setAddLoading] = useState(false);
  const [statusSearch, setStatusSearch] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {data: statusListData, isLoading: statusLoading} = useQuery({
    queryKey: ['getStatus', statusSearch],
    queryFn: () =>
      mainStorekeeperStore.getProductStatus({
        name: statusSearch!,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {mutate: editProductStatus} = useMutation({
    mutationKey: ['editProductStatus'],
    mutationFn: (params: IAddProductToCard) =>
      mainStorekeeperApi.editProductStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getMainStProduct']});
      addNotification('Статус успешного изменения');
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setAddLoading(false);
    },
  });

  const handleModalClose = () => {
    mainStorekeeperStore.setSingleProduct(null);
    mainStorekeeperStore.setIsOpenChangeStatusModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IAddProductToCard) => {
    setAddLoading(true);
    editProductStatus({
      ...values,
      pmsProductId: mainStorekeeperStore?.singleProduct?.wmsProductId!,
    });
  };

  const handleStatusSearch = (value: string) => {
    setStatusSearch(value);
  };

  const statusOptions = useMemo(
    () =>
      statusListData?.productStatusList?.map((status) => ({
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
      open={mainStorekeeperStore.isOpenChangeStatusModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
      title={`Изменить статус ${mainStorekeeperStore?.singleProduct?.partId}`}
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
          initialValue={mainStorekeeperStore?.singleProduct?.productStatus?.id}
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
          initialValue={mainStorekeeperStore?.singleProduct?.partId}
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
            placeholder={`${123456}`}
            style={{width: '100%'}}
            parser={parser}
          />
        </Form.Item>
        <Form.Item
          label={`Изменить из ${mainStorekeeperStore?.singleProduct?.quantity}`}
          rules={[{required: true}]}
          name="quantity"
          initialValue={mainStorekeeperStore?.singleProduct?.quantity!}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="10 шт"
            defaultValue={mainStorekeeperStore?.singleProduct?.quantity!}
            max={mainStorekeeperStore?.singleProduct?.quantity}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
