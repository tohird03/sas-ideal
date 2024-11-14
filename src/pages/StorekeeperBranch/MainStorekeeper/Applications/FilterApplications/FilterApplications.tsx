import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Col, DatePicker, DatePickerProps, Input, Row, Select} from 'antd';
import classnamesBind from 'classnames/bind';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import styles from '../apllications.scss';
import {applicationsFilterByStatusOptions} from '../constants';

const cn = classnamesBind.bind(styles);

export const FilterApplications: FC = () => {
  const navigate = useNavigate();
  const handleFilterApplicant = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    mainStorekeeperStore.setFilterApplicationsParams({
      ...mainStorekeeperStore.filterApplicationsParams,
      flag: e.target.value.trim(),
    });
  };

  const handleSearchRecipient = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    mainStorekeeperStore.setFilterApplicationsParams({
      ...mainStorekeeperStore.filterApplicationsParams,
      client: e.target.value.trim(),
    });
  };

  const onChangeCreatedAt: DatePickerProps['onChange'] = (date, dateString) => {
    if (dateString) {
      const dateObject = new Date(dateString);

      mainStorekeeperStore.setFilterApplicationsParams({
        ...mainStorekeeperStore.filterApplicationsParams,
        createdAt: dateObject,
      });
    } else {
      mainStorekeeperStore.setFilterApplicationsParams({
        ...mainStorekeeperStore.filterApplicationsParams,
        createdAt: null,
      });
    }
  };

  const onChangeDeliverDate: DatePickerProps['onChange'] = (date, dateString) => {
    if (dateString) {
      const dateObject = new Date(dateString);

      mainStorekeeperStore.setFilterApplicationsParams({
        ...mainStorekeeperStore.filterApplicationsParams,
        deliveryDate: dateObject,
      });
    } else {
      mainStorekeeperStore.setFilterApplicationsParams({
        ...mainStorekeeperStore.filterApplicationsParams,
        deliveryDate: null,
      });
    }
  };

  const handleStatusFilter = (
    value: string
  ) => {
    mainStorekeeperStore.setFilterApplicationsParams({
      ...mainStorekeeperStore.filterApplicationsParams,
      status: value,
    });
  };

  const handlenavigate = () => {
    mainStorekeeperStore.setLocalApplication(null);
    mainStorekeeperStore.setLocalReqProducts([]);
    navigate('/mainstorekeeper/application-add-edit');
  };

  return (
    <>
      <div className={cn('applicationsHeader')}>
        <Row
          gutter={24}
          align={'middle'}
          justify={'end'}
        >
          <Col xl={3} lg={4} md={6} sm={12} xs={24}>
            <Select
              options={applicationsFilterByStatusOptions}
              allowClear
              placeholder="По статусу"
              onChange={handleStatusFilter}
              className={cn('applicationFilterParameter')}
            />
          </Col>
          <Col xl={3} lg={4} md={9} sm={12} xs={24}>
            <DatePicker
              onChange={onChangeCreatedAt}
              placeholder="По дате создания"
              className={cn('applicationFilterParameter')}
            />
          </Col>
          <Col xl={3} lg={4} md={9} sm={12} xs={24}>
            <DatePicker
              onChange={onChangeDeliverDate}
              placeholder="По дате доставки"
              className={cn('applicationFilterParameter')}
            />
          </Col>
          <Col xl={4} lg={4} md={12} sm={12} xs={24}>
            <Input
              className={cn('applicationsSearchInput')}
              placeholder="Поиск по заявителю"
              allowClear
              onChange={handleFilterApplicant}
              addonAfter={<SearchOutlined />}
            />
          </Col>
          <Col xl={4} lg={4} md={12} sm={12} xs={24}>
            <Input
              className={cn('applicationsSearchInput')}
              placeholder="Поиск по получателю"
              allowClear
              onChange={handleSearchRecipient}
              addonAfter={<SearchOutlined />}
            />
          </Col>
          <Col xl={3} lg={4} md={24} sm={12} xs={24}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handlenavigate}
              block
            >
              Новый
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

