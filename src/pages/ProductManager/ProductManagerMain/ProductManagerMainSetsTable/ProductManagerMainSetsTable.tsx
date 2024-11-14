import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Table} from 'antd';
import {IGetProductManagerMainSets} from '@/api/productmanager/tyes';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {productManagerMainSetsColumn} from '../constant';

const productManagerMainSetsData: IGetProductManagerMainSets[] = [
  {
    id: '1',
    name: 'Настя',
    category: 'Кухня',
    provider: 'Джуля Бест',
    note: 'Заголовок текст...',
    purchasePrice: '12 000 000 сум',
    rosePrice: '13 000 000 сум',
  },
  {
    id: '2',
    name: 'Настя',
    category: 'Кухня',
    provider: 'Джуля Бест',
    note: 'Заголовок текст...',
    purchasePrice: '12 000 000 сум',
    rosePrice: '13 000 000 сум',
  },
];


export const ProductManagerMainSetsTable = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <>
      <main>
        <Table
          // loading={loading}
          columns={productManagerMainSetsColumn}
          dataSource={productManagerMainSetsData}
        />
      </main>
    </>
  );
});
