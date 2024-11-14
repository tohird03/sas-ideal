import React from 'react';
import {observer} from 'mobx-react';
import {FilterFilled, SearchOutlined} from '@ant-design/icons';
import {Button, Input} from 'antd';
import classnamesBind from 'classnames/bind';
import {sellerStore} from '@/stores/seller';
import styles from '../bascket-products.scss';

const cn = classnamesBind.bind(styles);

export const FilterHeader = observer(() => {
  const handleOpenFilterModal = () => {
    sellerStore.setIsOpenSellerFilterModal(true);
  };

  return (
    <div className={cn('basketFilterHeaderWrapp')}>
      <Button
        onClick={handleOpenFilterModal}
        icon={<FilterFilled style={{opacity: '0.5'}} />}
      >
        Фильтр
      </Button>
      <Input
        className={cn('basketSearch')}
        placeholder="введите текст для поиска"
        addonAfter={<SearchOutlined />}
      />
    </div>
  );
});
