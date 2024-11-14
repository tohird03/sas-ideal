import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Checkbox, List, Modal} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {roleApi} from '@/api/role';
import {IAssignAndUnAssignPerToRoleParams} from '@/api/role/types';
import {IPermession} from '@/api/users/types';
import {rolesStore} from '@/stores/superAdmin';
import {addNotification} from '@/utils';
import styles from '../roles.scss';

const cn = classNames.bind(styles);

export const AssignPerModal = observer(() => {
  const [selectPerForAssign, setSelectPerForAssign] = useState<IPermession[]>([]);

  const {data: persWithRole, isLoading: persWithRoleLoading} = useQuery({
    queryKey: ['getPermessionsWithRole', rolesStore.singleRole?.id],
    queryFn: () => roleApi.getPerByRole(rolesStore.singleRole?.id!),
    enabled: !!rolesStore.singleRole?.id,
  });

  const {mutate: assinPerToRole, isPending: loading} =
    useMutation({
      mutationKey: ['assinPerToRole'],
      mutationFn: (params: IAssignAndUnAssignPerToRoleParams) => roleApi.assignPer(params),
      onSuccess: (data: AxiosResponse) => {
        rolesStore.getActiveRole(rolesStore?.singleRole?.id!);
        if (data?.status === 204) {
          addNotification('Успешное назначение разрешения');
          handleModalClose();
        }
      },
      onError: addNotification,
    });

  const handleModalClose = () => {
    rolesStore.setSingleRole(null);
    rolesStore.setIsOpenAssignPerModal(false);
  };

  const handleModalOk = () => {
    assinPerToRole({
      roleId: rolesStore?.singleRole?.id!,
      permissions: selectPerForAssign,
    });
  };

  const handleSelectPerForAssign = (event: CheckboxChangeEvent, checkPer: IPermession) => {
    const isChecked = event.target.checked;

    setSelectPerForAssign(prevSelected => {
      if (isChecked) {
        const isAlreadySelected = prevSelected.some(per => per.id === checkPer.id);

        if (!isAlreadySelected) {
          return [...prevSelected, checkPer];
        }

        return prevSelected;
      } else {
        return prevSelected.filter(per => per.id !== checkPer.id);
      }
    });
  };

  return (
    <Modal
      open={rolesStore.isOpenAssignPerModal}
      title={'Назначить разрешение'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText="Назначать"
      cancelText="Отмена"
      centered
      confirmLoading={loading}
      okButtonProps={{disabled: selectPerForAssign?.length === 0}}
    >
      <List
        bordered
        loading={persWithRoleLoading}
        style={{maxHeight: '500px', overflow: 'auto'}}
        dataSource={persWithRole?.permissions?.filter(per => !per?.status)}
        renderItem={per => (
          <List.Item
            className={cn(`roles__per-list-item
              ${Boolean(selectPerForAssign?.find(checkPer => checkPer?.id === per?.id))
                && 'roles__per-list-check-item'}`)}
          >
            <Checkbox
              key={per?.id}
              onChange={(event) => handleSelectPerForAssign(event, per)}
            >
              {per?.name}
            </Checkbox>
          </List.Item>
        )}
      />
    </Modal>
  );
});
