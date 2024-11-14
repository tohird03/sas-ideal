import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
import {CSS} from '@dnd-kit/utilities';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Avatar, Badge, Button, Col, Divider, Dropdown, Popconfirm, Row, Space} from 'antd';
import {imgStages} from '@/api/endpoints';
import {usersApi} from '@/api/users/users';
import {wmsWarehouseApi} from '@/api/wmsWarehouses';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {warehouseStore} from '@/stores/warehouse';
import {addNotification} from '@/utils';


export const SectionItem = observer((props) => {
  const queryClient = useQueryClient();

  const {mutate: deleteWarehouse} =
    useMutation({
      mutationKey: ['deleteWarehouse'],
      mutationFn: (warehouseId) => wmsWarehouseApi.deleteWarehouse(warehouseId),
      onSuccess: () => {
        addNotification('Успешное удаление склада');
        queryClient.invalidateQueries({queryKey: ['getAllWarehouse']});
      },
      onError: addNotification,
    });

  const {id, items, name, data, isSortingContainer, dragOverlay, columns} = props;
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'SECTION',
    },
  });

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);

  const getColumnHeight = () => {
    const h = document.getElementsByClassName('kanban-column')[0].clientHeight;

    return h;
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    height: dragOverlay ? `${`${getColumnHeight()}px`}` : null,
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: dragOverlay
      // eslint-disable-next-line max-len
      ? '0 0 0 calc(1px / 1) rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
      : '',
    border: dragOverlay
      ? '1px solid rgba(64, 150, 255, 1)'
      : '1px solid #dcdcdc',
    touchAction:
      'ontouchstart' in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
        ? 'manipulation'
        : 'none',
  };

  const handleAddStorekeeper = () => {
    mainStorekeeperStore.setUpdateWarehouse(columns);
    mainStorekeeperStore.setIsOpenAddStorekepeerModal(true);
  };

  const handleEditWarehouse = () => {
    mainStorekeeperStore.setUpdateWarehouse(columns);
    mainStorekeeperStore.setIsOpenAddNewWarehouseModal(true);
  };

  const handleDeleteWarehouse = () => {
    deleteWarehouse(columns?.id);
  };

  const handleGetShowroomUsers = (id) => {
    warehouseStore.setIsActiveWarehouseUsersId(id);
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    if (id === warehouseStore?.isActiveWarehouseUsersId) {
      wmsWarehouseApi.getWarehouseUsers({
        pageSize, pageNumber, warehouseId: warehouseStore?.isActiveWarehouseUsersId,
      })
        .then(res => {
          const getUsersData = res?.userList?.map(user => ({
            ...user,
            id: user?.id,
            col_id: warehouseStore?.isActiveWarehouseUsersId,
            name: `${user?.firstName} ${user?.lastName}`,
            phone: user?.phone,
            avatar: user?.avatar,
          }));

          warehouseStore.setWarehouseUsers([...warehouseStore.warehouseUsers, ...getUsersData]);
          warehouseStore.setIsActiveWarehouseUsersId(null);
        })
        .catch(addNotification);
    }
  }, [warehouseStore.isActiveWarehouseUsersId]);

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={style}
    >
      <div
        style={{
          cursor: dragOverlay ? 'grabbing' : 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '8px',
        }}
      >
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="kanban-column-header"
          style={{flexGrow: 1}}
        >
          {name}
          <Badge
            count={items.length ? items.length : 0}
            showZero
            style={{
              backgroundColor: '#52c41a',
              color: '#fff',
              marginLeft: '10px',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginRight: '10px',
          }}
        >
          <Button
            icon={<EditOutlined />}
            onClick={handleEditWarehouse}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddStorekeeper}
          />
          <Popconfirm
            title="Удалить шоурум"
            description="Вы уверены, что удалите этот шоурум?"
            onConfirm={handleDeleteWarehouse}
            okText="Да"
            okButtonProps={{style: {background: 'red'}}}
            cancelText="Нет"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      </div>
      <div className="kanban-column-list">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
          style={{display: 'flex', alignItems: 'flex-start'}}
        >
          {items.map((item) => (
            <FieldItem
              id={item}
              key={item}
              item={data.filter((d) => `${d.id}` === item)[0]}
              disabled={isSortingContainer}
            />
          ))}
        </SortableContext>
        <Button
          loading={warehouseStore?.isActiveWarehouseUsersId === id}
          icon={<DownOutlined />}
          style={{width: '100%'}}
          onClick={handleGetShowroomUsers?.bind(null, id)}
        />
      </div>
    </div>
  );
});


export const FieldItem = observer((props) => {
  const {id, item, dragOverlay} = props;
  const [dragDisabled, setDragDisabled] = useState(false);
  const {
    setNodeRef,
    listeners,
    isDragging,
    transform,
    transition,
    attributes,
  } = useSortable({
    id,
    disabled: dragDisabled,
    data: {
      type: 'FIELD',
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: dragOverlay
      // eslint-disable-next-line max-len
      ? '0 0 0 calc(1px / 1) rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
      : '',
    border: dragOverlay
      ? '1px solid rgba(64, 150, 255, 1)'
      : '1px solid #dcdcdc',
    cursor: dragOverlay ? 'grabbing' : 'grab',
    touchAction:
      window.PointerEvent ||
        'ontouchstart' in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
        ? 'manipulation'
        : 'none',
  };

  const handleDelete = () => {
    usersApi.revokeRole({
      userId: item?.id,
      role: 'storekeeper',
    })
      .then(() => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        mainStorekeeperStore.setWarehouseUsers([...mainStorekeeperStore.warehouseUsers?.filter(el => el?.id !== item?.id)]);
      })
      .catch(addNotification);
  };

  const handleChangeStorekeeper = () => {
    mainStorekeeperStore.setSingleStorekeeper(item);
    mainStorekeeperStore.setIsOpenAddStorekepeerModal(true);
  };

  const items = [
    {
      key: '1',
      label: (
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              onClick={handleChangeStorekeeper}
            >
              <EditOutlined />
                Изменять
            </Button>
          </Col>
        </Row>
      ),
    },
    {
      key: '3',
      label: (
        <Row>
          <Col span={24}>
            <Popconfirm
              title="Удалить пользователя"
              description="Вы уверены, что хотите удалить этого пользователя?"
              onConfirm={handleDelete}
              okText="Да"
              okButtonProps={{style: {background: 'red'}}}
              cancelText="Нет"
            >
              <Button style={{color: 'red'}}>
                <DeleteOutlined style={{color: 'red'}} />
                Удалить
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  const handleOpenChange = (open) => {
    setDragDisabled(open);
  };

  return (
    <div
      ref={props.disabled ? null : setNodeRef}
      className="card"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div>
        <Row justify="space-between">
          <Col span={20}>
            <Avatar
              src={`${imgStages?.apiUrl}${item?.avatar}`}
              icon={<UserOutlined />}
            />
          </Col>
          <Col span={4}>
            <Dropdown
              onOpenChange={handleOpenChange}
              menu={{items}}
              placement="bottomRight"
              arrow
            // trigger="click"
            >
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          </Col>
        </Row>
        <Divider />
        <Row style={{marginBottom: '10px'}}>
          <Col span={24}>
            <Space style={{display: 'flex', gap: '15px'}}>
              <Space>
                <UserOutlined />
                {item?.name}
              </Space>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space style={{display: 'flex', gap: '15px'}}>
              <Space>
                <PhoneOutlined />
                {item?.phone}
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
});
