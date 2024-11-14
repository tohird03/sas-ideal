import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {Button, DatePicker, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import {visitedClientsStore} from '@/stores/seller';
import styles from '../about-visited-clients.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    visitedClientsStore.setSearch(event.currentTarget.value);
  };

  const handleDateChange = (values: any, formatString: [string, string]) => {
    visitedClientsStore.setFromDate(new Date(formatString[0]));
    visitedClientsStore.setToDate(new Date(formatString[1]));
  };

  const handleAddNewVisitedClient = () => {
    visitedClientsStore.setIsOpenAddNewVisitedClient(true);
  };

  return (
    <div className={cn('about-visited-clients__filter-wrapper')}>
      <Typography.Title level={3}>
        Учет посетителей
      </Typography.Title>
      <div className={cn('about-visited-clients__filter-wrapper')}>
        <Input
          placeholder="Поиск по имени клиента и телефону клиента"
          onChange={handleSearch}
          className={cn('about-visited-clients__search')}
        />

        <DatePicker.RangePicker
          className={cn('about-visited-clients__filter')}
          onChange={handleDateChange}
        />
        <Button
          onClick={handleAddNewVisitedClient}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
            Новый
        </Button>
      </div>
    </div>
  );
});
