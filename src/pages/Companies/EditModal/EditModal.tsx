import React from 'react';
import {observer} from 'mobx-react';
import {useQueryClient} from '@tanstack/react-query';
import {Form, Input} from 'antd';
import Modal from 'antd/es/modal/Modal';
import classNames from 'classnames';
import {useBoolean} from 'usehooks-ts';
import {IAddCompany} from '@/api/companys/types';
import {companysStore} from '@/stores/company';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../company.scss';

const cn = classNames.bind(styles);

export const CompanysDynamicModal = observer(() => {
  const {value: loading, setTrue, setFalse} = useBoolean(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const company = companysStore.company;

  const handleCancel = () => {
    companysStore.setDynamicModalOpenOrClose(false);
    companysStore.setCompany(null);
  };

  const handleModalOk = () => {
    form.submit();
  };

  // onError: addNotification,
  // onSettled: async () => {
  //   setLoading(false);
  // },

  const handleSubmit = (value: IAddCompany) => {
    setTrue();

    const trimmedObject = trimValues(value);


    if (company?.id) {
      companysStore.editCompany(company?.id, trimmedObject)
        .then((res) => {
          if (res?.status === 204) {
            queryClient.invalidateQueries({queryKey: ['getCompanys']});
            handleCancel();
          }
        })
        .finally(setFalse);

      return;
    }

    companysStore.postCompany({...value})
      .then((res) => {
        if (res?.status === 204) {
          queryClient.invalidateQueries({queryKey: ['getCompanys']});
          handleCancel();
        }
      })
      .finally(setFalse);
  };

  return (
    <Modal
      centered
      title={company?.id ? 'Изменить компанию' : 'Создать компанию'}
      open={companysStore.dynamicModalOpen}
      onCancel={handleCancel}
      onOk={handleModalOk}
      okText={company?.id ? 'Подтверждать' : 'Создать'}
      okButtonProps={{loading}}
      cancelText="Отмена"
      confirmLoading={loading}
    >
      <Form
        className={cn('dynamicModalForm')}
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[{required: true, message: 'Name is required'}]}
          initialValue={company?.name}
        >
          <Input placeholder="Название компании" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
