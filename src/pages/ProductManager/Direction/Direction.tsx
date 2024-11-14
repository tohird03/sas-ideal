import React from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {directionApi} from '@/api/direction';
import {DataTable} from '@/components/Datatable/datatable';
import {pmDirectionStore} from '@/stores/productManager';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditDirectionModal} from './AddEditDirectionModal';
import {directionColumns} from './constants';
import styles from './direction.scss';

const cn = classNames.bind(styles);

export const Direction = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: directionData, isLoading: loading} = useQuery({
    queryKey: [
      'getDirection',
      pmDirectionStore.pageNumber,
      pmDirectionStore.pageSize,
      pmDirectionStore.searchTitle,
    ],
    queryFn: () =>
      directionApi.getDirection({
        pageNumber: pmDirectionStore.pageNumber,
        pageSize: pmDirectionStore.pageSize,
        title: pmDirectionStore.searchTitle!,
      }),
  });

  const handleAddDirection = () => {
    pmDirectionStore.setIsOpenAddEditDirectionModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pmDirectionStore.setSearchTitle(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    pmDirectionStore.setPageNumber(page);
    pmDirectionStore.setPageSize(pageSize!);
  };

  return (
    <main>
      <div className={cn('direction__head')}>
        <Typography.Title level={3}>Углы</Typography.Title>
        <div className={cn('direction__filter')}>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('direction__search')}
          />
          <Button
            onClick={handleAddDirection}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый Углы
          </Button>
        </div>
      </div>

      <DataTable
        columns={directionColumns}
        data={directionData?.directionList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: directionData?.count,
          current: pmDirectionStore?.pageNumber,
          pageSize: pmDirectionStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(directionData?.count),
        }}
      />

      {pmDirectionStore.isOpenAddEditDirectionModal && <AddEditDirectionModal />}
    </main>
  );
});
