import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Select, TreeSelect, Typography} from 'antd';
import classNames from 'classnames';
import {IMyLogs} from '@/api/myLogs/types';
import {DataTable} from '@/components/Datatable/datatable';
import {myLogsStore} from '@/stores/myLogs';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {myLogsColumns} from './constants';
import styles from './tasks.scss';

const cn = classNames.bind(styles);

const treeData = [
  {
    title: 'Node1',
    value: '123456789',
    children: [
      {
        title: 'Child Node1',
        value: '23r4t56hgrewfq',
        children: [
          {
            title: 'Child Node1',
            value: 'asrgwergwegtbweg',
          },
          {
            title: 'Child Node2',
            value: 'qregergeqrgqerg',
          },
        ],
      },
      {
        title: 'Child Node2',
        value: 'asdargqrgqerasdverv',
        children: [
          {
            title: 'Child Node1',
            value: 'ASFargqrgqrgqrg',
          },
          {
            title: 'Child Node2',
            value: 'awegfqwdsvcqerf',
          },
        ],
      },
    ],
  },
];

export const MyLogs = observer(() => {
  const [categoryValue, setCategoryValue] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: tasksData, isLoading: loading} = useQuery({
    queryKey: ['getTasks',
      myLogsStore.date,
      myLogsStore.modelName,
      myLogsStore.sellerName,
      myLogsStore.page,
      myLogsStore.limit],
    queryFn: () =>
      myLogsStore.getTasks({
        date: myLogsStore.date,
        seller: myLogsStore.sellerName,
        model: myLogsStore.modelName,
        pageNumber: myLogsStore.page,
        pageSize: myLogsStore.limit,
      }),
  });


  const handleChange = (value: string) => {
    myLogsStore.setDate(value);
  };

  const onChangeCategory = (newValue: string[]) => {
    setCategoryValue(newValue);
  };

  const handleSearchSeller = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    myLogsStore.setSellerSearch(e.currentTarget.value.trim());
  };
  const handleSearchModel = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    myLogsStore.setModelName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    myLogsStore.setPage(page);
    myLogsStore.setLimit(pageSize!);
  };

  return (
    <main>
      <div className={cn('mylogs__head')}>
        <Typography.Title level={3}>Мои задачи</Typography.Title>
        <div className={cn('mylogs__filter')}>
          <Select
            placeholder="Фильтровать по времени"
            className={cn('users__searchBy')}
            value={myLogsStore?.date}
            onChange={handleChange}
            options={[
              {value: 'asc', label: 'По возрастанию'},
              {value: 'desc', label: 'По убыванию'},
            ]}
            style={{width: '200px'}}
          />
          <TreeSelect
            style={{width: '300px'}}
            value={categoryValue}
            dropdownStyle={{maxHeight: 600, overflow: 'auto'}}
            treeData={treeData}
            placeholder="Категория"
            treeDefaultExpandAll
            treeCheckable
            onChange={onChangeCategory}
          />
          <Input
            placeholder="Поиск по названию продавца"
            allowClear
            onChange={handleSearchSeller}
            className={cn('mylogs__search')}
          />
          <Input
            placeholder="Поиск по названию модели"
            allowClear
            onChange={handleSearchModel}
            className={cn('mylogs__search')}
          />
        </div>
      </div>

      <DataTable
        columns={myLogsColumns}
        data={tasksData?.taskList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: 1,
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(1),
        }}
      />
    </main>
  );
});
