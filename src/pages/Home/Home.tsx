import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EyeOutlined, UserAddOutlined, UserOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Avatar, Button, Input, Modal, Select, Tag, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import {IUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {DataTable} from '@/components/Datatable/datatable';
import {ROUTES} from '@/constants';
import {usersStore} from '@/stores/users';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {getRowIndex} from '@/utils/getRowIndex';
import {useMediaQuery} from '@/utils/mediaQuery';
import {UsersAction} from './Action';
import {CompaniesModal} from './Companies';
import styles from './home.scss';
import {ResetPasswordModal} from './ResetPassword';
import {RolesModal} from './RolesModal';

const cn = classNames.bind(styles);

export const Home = observer(() => {
  const [imgShowModal, setImgShowModal] = useState(false);
  const [imgShowSrc, setImgShowSrc] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 800px)');
  const navigate = useNavigate();

  const {data: users, isLoading: loading} = useQuery({
    queryKey: ['getUsers',
      usersStore.page,
      usersStore.limit,
      usersStore.search,
      usersStore.company],
    queryFn: () => usersStore.getUsers({
      page: usersStore.page,
      pageSize: usersStore.limit,
      search: usersStore.search,
      searchBy: usersStore.searchBy,
      company: usersStore.company!,
    }),
  });

  const {data: fullCompany, isLoading: companyLoading} = useQuery({
    queryKey: ['getFullCompany'],
    queryFn: () => usersApi.getAllCompanies(),
  });

  const handleAddUser = () => {
    navigate(ROUTES.userAdd);
  };

  const handleCompanyChange = (value: string) => {
    usersStore.setCompany(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    usersStore.setSearch(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    usersStore.setPage(page);
    usersStore.setLimit(pageSize!);
  };

  const handleCompanyShow = (user: IUser) => {
    usersStore.setIsOpenCompaniesModal(true);
    usersStore.setSingleUser(user);
  };

  const handleRolesShow = (user: IUser) => {
    usersStore.setIsOpenRolesModal(true);
    usersStore.setSingleUser(user);
  };

  const handleOpenImg = (src: string) => {
    setImgShowSrc(src);
    setImgShowModal(true);
  };

  const handleCloseShowModal = () => {
    setImgShowSrc(null);
    setImgShowModal(false);
  };

  const allCompanyOptions = useMemo(() => (
    fullCompany?.map(company => ({
      label: company?.name,
      value: company?.id,
    }))
  ), [fullCompany]);

  const usersColumns = useMemo(() => {
    const usersColumns: ColumnType<IUser>[] = [
      {
        key: 'index',
        dataIndex: 'index',
        title: '#',
        align: 'center',
        render: (value, record, index) => getRowIndex(usersStore.page, usersStore.limit, index),
      },
      {
        key: 'avatar',
        dataIndex: 'avatar',
        title: 'Изображение',
        align: 'center',
        render: (value) => (
          <Avatar
            style={{cursor: 'pointer'}}
            onClick={value ? handleOpenImg.bind(null, value) : undefined}
            src={`${imgStages?.apiUrl}${value}`} icon={<UserOutlined />}
          />
        ),
      },
      {
        key: 'username',
        dataIndex: 'username',
        title: 'Полное имя',
        align: 'center',
        render: (value, record) => (
          <>
            {/* TODO */}
            {/* <Link
              href={`/users/${record?.id}`}
              style={{
                color: '#000',
                fontWeight: 'bolder',
                cursor: 'pointer',
              }}
            >
              {`${record?.firstName || ''} ${record?.lastName || ''}`}
            </Link> */}
            {`${record?.firstName || ''} ${record?.lastName || ''}`}
          </>
        ),
      },
      {
        key: 'phone',
        dataIndex: 'phone',
        title: 'Телефон',
        align: 'center',
        render: (value) => value,
      },
      {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: 'Дата начала',
        align: 'center',
        render: (value, record) => <span>{getFullDateFormat(record?.createdAt)}</span>,
      },
      // {
      //   key: 'last',
      //   dataIndex: 'last',
      //   title: 'Последняя активность',
      //   align: 'center',
      //   render: (value) => <span>{getFullDateFormat('11.23.2023 03:20')}</span>
      // },
      {
        key: 'compoany',
        dataIndex: 'compoany',
        title: 'Компании',
        align: 'center',
        render: (value, record) => (
          <Tag
            onClick={handleCompanyShow.bind(null, record)}
            color="cyan"
            style={{cursor: 'pointer'}}
          >
            {
              record?.companies.length === 0
                ? '0'
                : record?.companies.length === 1
                  ? record?.companies[0]?.name
                  : `${record?.companies[0]?.name}, +${record?.companies?.slice(1).length}...`
            }
          </Tag>
        ),
      },
      {
        key: 'role',
        dataIndex: 'role',
        title: 'Роли',
        align: 'center',
        render: (value, record) => (
          <Button
            onClick={handleRolesShow.bind(null, record)}
            color="cyan"
            type="primary"
            style={{cursor: 'pointer'}}
            icon={<EyeOutlined />}
          />
        ),
      },
      // {
      //   key: 'rating',
      //   dataIndex: 'rating',
      //   title: 'Рейтинг',
      //   align: 'center',
      //   render: (value, record) => <Rate tooltips={ratingTooltipDesc} disabled allowHalf value={record?.rating} />,
      // },
      {
        key: 'action',
        dataIndex: 'action',
        title: 'Action',
        align: 'center',
        render: (value, record) => <UsersAction user={record} />,
      },
    ];

    return usersColumns;
  }, []);

  useEffect(() => () => {
    usersStore.setSearch('');
  }, []);

  return (
    <main>
      <div className={cn('users__head')}>
        <Typography.Title level={3}>Пользователи</Typography.Title>
        <div className={cn('users__filter')}>
          <Input
            placeholder="Поиск пользователей"
            allowClear
            onChange={handleSearch}
            className={cn('users__search')}
          />
          <Select
            options={allCompanyOptions}
            onChange={handleCompanyChange}
            loading={companyLoading}
            className={cn('users__company')}
            placeholder="Фильтровать по компании"
          />
          <Button
            onClick={handleAddUser}
            type="primary"
            icon={<UserAddOutlined />}
          >
          Добавить новое
          </Button>
        </div>
      </div>

      <DataTable
        columns={usersColumns}
        data={users?.userList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: users?.count,
          current: usersStore.page,
          pageSize: usersStore.limit,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(users?.count),
        }}
      />

      {usersStore.isOpenCompaniesModal && <CompaniesModal />}
      {usersStore.isOpenResetPasswordModal && <ResetPasswordModal />}
      {usersStore.isOpenRolesModal && <RolesModal />}
      {imgShowModal && (
        <Modal
          open={imgShowModal}
          onCancel={handleCloseShowModal}
          okButtonProps={{style: {display: 'none'}}}
          cancelText="Закрывать"
          width={400}
        >
          <img
            alt="Show user img"
            width={300}
            height={300}
            style={{display: 'flex', margin: '0 auto', objectFit: 'cover'}}
            src={`${imgStages?.apiUrl}${imgShowSrc}`}
          />
        </Modal>
      )}
    </main>
  );
});
