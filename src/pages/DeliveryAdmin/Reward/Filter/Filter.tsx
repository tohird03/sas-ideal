import React from 'react';
import {observer} from 'mobx-react';
import {DatePicker, Input, Typography} from 'antd';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import {requestStore} from '@/stores/dms';
import styles from '../reward.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    requestStore.setClosedFlightNameSearch(event.currentTarget.value.trim() || null);
  };

  const handlePhoneSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    requestStore.setClosedFlightPhoneSearch(event.currentTarget.value.trim() || null);
  };

  const handleDateChange = (values: any, formatString: [string, string]) => {
    requestStore.setClosedFlightStartDate(new Date(formatString[0]));
    requestStore.setClosedFlightEndDate(new Date(formatString[1]));
  };

  return (
    <div className={cn('reward__filter-wrapper')}>
      <Typography.Title level={3}>
        Вознограждение
      </Typography.Title>
      <div className={cn('reward__filter-wrapper')}>
        <Input
          onChange={handleNameSearch}
          className={cn('reward__search')}
          placeholder="поиск по имя курьера"
        />

        <Input
          placeholder="поиск по телефону курьера"
          onChange={handlePhoneSearch}
          className={cn('reward__search')}
        />

        <DatePicker.RangePicker
          className={cn('reward__filter')}
          defaultValue={[dayjs(requestStore.closedFlightStartDate), dayjs(requestStore.closedFlightEndDate)]}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
});
