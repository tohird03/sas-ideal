import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import classNames from 'classnames';
import {ICompany} from '@/api/companys/types';
import {companysStore} from '@/stores/company';
import styles from '../company.scss';

const cn = classNames.bind(styles);

type Props = {
  data: ICompany;
};

export const CompanyAction = observer(({data}: Props) => {
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handelOpenModal = () => {
    companysStore.setDynamicModalOpenOrClose(true);
  };

  const handleSaveDataStore = () => {
    companysStore.setCompany(data);
  };

  const handleEditCompanies = () => {
    handelOpenModal();
    handleSaveDataStore();
  };

  const handleDeleteCompany = () => {
    setDeleteLoading(true);
    companysStore.deleteCompany(data?.id)
      .then((res) => {
        if (res?.status === 204) {
          queryClient.invalidateQueries({queryKey: ['getCompanys']});
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <div className={cn('actionButtonsWrapp')}>
      <Button
        className={cn('actionDeleteButton')}
        icon={<EditOutlined />}
        type="primary"
        onClick={handleEditCompanies}
      />
      <Popconfirm
        placement="topLeft"
        title="Внимание !"
        description="Вы уверены, что хотите удалить компанию?"
        onConfirm={handleDeleteCompany}
        okButtonProps={{loading: deleteLoading}}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="primary"
          className={cn('actionEditButton')}
          icon={<DeleteOutlined />}
          danger
        />
      </Popconfirm>
    </div>
  );
});
