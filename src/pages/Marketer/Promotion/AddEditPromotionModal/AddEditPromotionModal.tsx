import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {DatePicker, Form, Input, Modal} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs, {Dayjs} from 'dayjs';
import {promotionApi} from '@/api/promotion';
import {IAddEditPromotion} from '@/api/promotion/types';
import {promotionStore} from '@/stores/marketer';
import {addNotification} from '@/utils';
import {notEmptyFieldRules} from '@/utils/formValidators';
import {trimValues} from '@/utils/trimObjectFunc';

export const AddEditPromotionModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  const {mutate: addPromotion} =
    useMutation({
      mutationKey: ['addPromotion'],
      mutationFn: (params: IAddEditPromotion) => promotionApi.addPromotion(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getPrmotion']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updatePromotion} =
    useMutation({
      mutationKey: ['updatePromotion'],
      mutationFn: (params: IAddEditPromotion) => promotionApi.editPromotion(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getPrmotion']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleModalClose = () => {
    promotionStore.setSinglePromotion(null);
    promotionStore.setIsOpenAddEditPromotion(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (value: IAddEditPromotion) => {
    setLoading(true);
    const trimmedObject = trimValues(value);

    if (promotionStore?.singlePromotion) {
      updatePromotion({
        ...trimmedObject,
        id: promotionStore.singlePromotion?.id,
      });

      return;
    }
    addPromotion(trimmedObject);
  };

  useEffect(() => {
    if (promotionStore.singlePromotion) {
      form.setFieldsValue({
        ...promotionStore.singlePromotion,
        startDate: dayjs(promotionStore.singlePromotion?.startDate),
        endDate: dayjs(promotionStore.singlePromotion?.endDate),
      });
    }
  }, [promotionStore.singlePromotion]);

  return (
    <Modal
      open={promotionStore.isOpenAddEditPromotion}
      title={promotionStore.singlePromotion ? 'Изменить акция' : 'Новый акция'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Создать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
      width={400}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Наименование"
          rules={[
            {required: true},
            notEmptyFieldRules(),
          ]}
        >
          <Input placeholder="Наименование" />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Дата начало"
          rules={[{required: true}]}
        >
          <DatePicker
            style={{width: '100%'}}
            format={'YYYY-MM-DD'}
            onChange={(date) => {
              setStartDate(date);
              form.validateFields(['endDate']);
            }}
          />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Дата окончании"
          rules={[
            {required: true},
            ({getFieldValue}) => ({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              validator(_, value) {
                const startDate = getFieldValue('startDate');

                if (!value || !startDate || value.isAfter(startDate)) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Дата окончания должна быть позже даты начала'));
              },
            }),
          ]}
        >
          <DatePicker
            style={{width: '100%'}}
            format={'YYYY-MM-DD'}
            disabledDate={(current) => current && current < startDate!}
          />
        </Form.Item>
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
