import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DeleteOutlined, EditOutlined, ToolOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {Button, Col, Popconfirm, Row, Tooltip} from 'antd';
import {IUser} from '@/api/users/types';
import {usersStore} from '@/stores/users';

type Props = {
  user: IUser;
};

export const UsersAction: FC<Props> = observer(({user}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAddUsers = () => {
    navigate(`/home/${user?.id}`);
  };

  const handleDelete = () => {
    usersStore.deleteUser(user?.id)
      .then(() => {
        queryClient.invalidateQueries({queryKey: ['getUsers']});
      });
  };

  const handleResetPasswordClick = () => {
    usersStore.setIsOpenResetPasswordModal(true);
    usersStore.setSingleUser(user);
  };

  return (
    <Row gutter={24} justify="center">
      <Col span={8}>
        <Button onClick={handleAddUsers} type="primary" icon={<EditOutlined />} />
      </Col>
      <Col span={8}>
        <Tooltip placement="bottom" title={'Сброс пароля'}>
          <Button
            type="primary"
            icon={<ToolOutlined />}
            onClick={handleResetPasswordClick}
          />
        </Tooltip>
      </Col>
      <Col span={8}>
        <Popconfirm
          title="Удалить пользователя"
          description="Вы уверены, что хотите удалить этого пользователя?"
          onConfirm={handleDelete}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Col>
    </Row>
  );
});
