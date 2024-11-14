import React from 'react';
import {observer} from 'mobx-react';
import {Button, Input, InputNumber, Typography} from 'antd';
import classNames from 'classnames/bind';
import {requestStore} from '@/stores/dms';
import styles from '../request.scss';

const cn = classNames.bind(styles);

export const Filter = observer(() => {

  const handleClientNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    requestStore.setRequestAndFlightClientSearch(event.currentTarget.value.trim());
  };

  const handleRequestrNameSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    requestStore.setRequestAndFlightRequestrSearch(event.currentTarget.value.trim());
  };

  const handleProductIdSearch = (value: string | null) => {
    requestStore.setRequestAndFlightProductIdSearch(value);
  };

  const handleAddFlight = () => {
    requestStore.setIsOpenAddFlightRequestModal(true);
  };

  return (
    <div className={cn('request__filter-wrapper')}>
      <Typography.Title level={3}>
        Заявки и Рейсы
      </Typography.Title>
      <div className={cn('request__filter-row-wrapper')}>
        <div className={cn('request__filter-col-wrapper')}>
          <Input
            onChange={handleClientNameSearch}
            placeholder="Поиск по клиенту"
            className={cn('request__search')}
          />
          <Input
            onChange={handleRequestrNameSearch}
            placeholder="Поиск по получателю"
            className={cn('request__search')}
          />
        </div>
        <div className={cn('request__filter-col-wrapper')}>
          <InputNumber
            onChange={handleProductIdSearch}
            placeholder="Поиск по продукт ид"
            className={cn('request__search')}
          />

          <Button
            onClick={handleAddFlight}
            type="primary"
            className={cn('request__search')}
          >
            Создать рейс
          </Button>
        </div>
      </div>
    </div>
  );
});
