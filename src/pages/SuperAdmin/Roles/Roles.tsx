import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {DeleteOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Alert, Button, Checkbox, Collapse, CollapseProps, List, Popconfirm, Typography} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {AxiosResponse} from 'axios';
import classNames from 'classnames/bind';
import {roleApi} from '@/api/role';
import {IAssignAndUnAssignPerToRoleParams} from '@/api/role/types';
import {IPermession, IRole} from '@/api/users/types';
import {rolesStore} from '@/stores/superAdmin';
import {addNotification} from '@/utils';
import {AddRolesModal} from './AddRolesModal';
import {AssignPerModal} from './AssignPerModal';
import styles from './roles.scss';

const cn = classNames.bind(styles);

export const Roles = observer(() => {
  const [rolesOptions, setRolesOptions] = useState<CollapseProps['items']>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const queryClient = useQueryClient();
  const [selectPerForUnAssign, setSelectPerForUnAssign] = useState<IPermession[]>([]);
  const [activeOpenRoleId, setActiveOpenRoleId] = useState<string | null>(null);

  const {data: allRoles} = useQuery({
    queryKey: ['getAllRoles'],
    queryFn: () => roleApi.getAllRoles(),
  });

  const {mutate: deleteRole} =
    useMutation({
      mutationKey: ['deleteRole'],
      mutationFn: (id: string) => roleApi.deleteRole(id!),
      onSuccess: (data: AxiosResponse) => {
        queryClient.invalidateQueries({queryKey: ['getAllRoles']});
        if (data?.status === 204) {
          addNotification('Успешное удаление роли');
        }
      },
      onError: addNotification,
    });

  const {mutate: unAssinPerToRole} =
    useMutation({
      mutationKey: ['unAssinPerToRole'],
      mutationFn: (params: IAssignAndUnAssignPerToRoleParams) => roleApi.unAssignPer(params),
      onSuccess: (data: AxiosResponse) => {
        if (data?.status === 204) {
          rolesStore.getActiveRole(activeOpenRoleId!)
            .finally(() => {
              setSelectPerForUnAssign([]);
            });
          addNotification('Успешное назначение разрешения');
        }
      },
      onError: addNotification,
    });

  const handleAddRole = () => {
    rolesStore.setIsOpenAddRoles(true);
  };

  const handleOpenCollapse = (key: string | string[]) => {
    setSelectPerForUnAssign([]);
    const activeHandleRole = key[0];

    if (activeHandleRole) {
      setActiveOpenRoleId(activeHandleRole);
      rolesStore.getActiveRole(activeHandleRole);
    } else {
      setActiveOpenRoleId(null);
    }
  };

  const handleUnAssignPersFromRole = (role: IRole) => {
    unAssinPerToRole({
      roleId: role?.id,
      permissions: selectPerForUnAssign,
    });
  };

  const handleDeleteRole = (event: any, roleId: string) => {
    event.stopPropagation();
    deleteRole(roleId);
  };

  const handleSelectPerForUnassign = (event: CheckboxChangeEvent, checkPer: IPermession) => {
    const isChecked = event.target.checked;

    setSelectPerForUnAssign(prevSelected => {
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


  const handleUnAssignPer = (role: IRole, delPer: IPermession) => {
    unAssinPerToRole({
      roleId: role?.id,
      permissions: [delPer],
    });
  };

  const handleOpenAssignPerModal = (event: any, role: IRole) => {
    event.stopPropagation();

    rolesStore.setSingleRole(role);
    rolesStore.setIsOpenAssignPerModal(true);
  };

  useEffect(() => {
    if (roles) {
      const rolesOptions = roles?.map(role => ({
        key: role?.id,
        label: role?.name,
        children: (
          <>
            {
              selectPerForUnAssign?.length > 0 && (
                <Alert
                  message={`Отменить назначение ${selectPerForUnAssign?.length} разрешений`}
                  type="error"
                  style={{marginBottom: '10px'}}
                  action={
                    <Popconfirm
                      title="Удалить разрешение"
                      description="Вы уверены, что хотите удалить этого разрешение?"
                      onConfirm={handleUnAssignPersFromRole.bind(null, role)}
                      okText="Да"
                      okButtonProps={{style: {background: 'red'}}}
                      cancelText="Нет"
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        type="primary"
                        danger
                      />
                    </Popconfirm>
                  }
                />
              )
            }
            <List
              bordered
              style={{maxHeight: '400px', overflow: 'auto'}}
              dataSource={role?.permissions}
              renderItem={per => (
                <List.Item
                  key={per?.id}
                  className={cn(`roles__per-list-item ${per?.id}
                  ${Boolean(selectPerForUnAssign?.find(checkPer => checkPer?.id === per?.id))
                    && 'roles__per-list-check-item'}`)}
                >
                  <Checkbox
                    checked={Boolean(selectPerForUnAssign.find(checkPer => checkPer.id === per.id))}
                    onChange={(event) => {
                      handleSelectPerForUnassign(event, per);
                    }}
                  >
                    {per?.name}
                  </Checkbox>

                  <Popconfirm
                    title="Удалить разрешение"
                    description="Вы уверены, что хотите удалить этого разрешение?"
                    onConfirm={handleUnAssignPer.bind(null, role, per)}
                    okText="Да"
                    okButtonProps={{style: {background: 'red'}}}
                    cancelText="Нет"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="primary"
                      danger
                    />
                  </Popconfirm>
                </List.Item>
              )}
            />
          </>
        ),
        extra: (
          <div className={cn('roles__collapse-action-wrapper')}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={(event) => handleOpenAssignPerModal(event, role)}
            />
            <Popconfirm
              title="Удалить роль"
              description="Вы уверены, что хотите удалить этого роль?"
              onConfirm={(event) => {
                handleDeleteRole(event, role?.id);
              }}
              okText="Да"
              okButtonProps={{style: {background: 'red'}}}
              cancelText="Нет"
            >
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                onClick={(event) => event.stopPropagation()}
              />
            </Popconfirm>
          </div>
        ),
      }));

      setRolesOptions(rolesOptions);
    }
  }, [roles, selectPerForUnAssign]);

  useEffect(() => {
    if (rolesStore.activeRole) {
      const rolesWithPer: IRole[] = roles?.map(role => {
        if (role?.id === rolesStore.activeRole?.id) {
          const filterPer = rolesStore.activeRole?.permissions?.filter(per => per.status);

          return {
            ...role,
            permissions: filterPer,
          };
        }

        return role;
      });

      setRoles(rolesWithPer);
    }
  }, [rolesStore.activeRole]);

  useEffect(() => {
    if (allRoles) {
      setRoles(allRoles);
    }
  }, [allRoles]);

  return (
    <>
      <div className={cn('roles__head')}>
        <Typography.Title level={3}>Роли</Typography.Title>
        <Button
          onClick={handleAddRole}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Новый роль
        </Button>
      </div>
      <Collapse
        className="roles"
        accordion
        items={rolesOptions}
        onChange={handleOpenCollapse}
      />

      {rolesStore.isOpenAddRoles && <AddRolesModal />}
      {rolesStore.isOpenAssignPerModal && <AssignPerModal />}
    </>
  );
});
