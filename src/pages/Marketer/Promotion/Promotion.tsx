import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, DatePicker, Input, Typography} from 'antd';
import classNames from 'classnames';
import {promotionApi} from '@/api/promotion';
import {DataTable} from '@/components/Datatable/datatable';
import {promotionStore} from '@/stores/marketer';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditPromotionModal} from './AddEditPromotionModal';
import {promotionColumns} from './constants';
import styles from './promotion.scss';

const cn = classNames.bind(styles);

export const Promotion = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const {data: promotionData, isLoading: loading} = useQuery({
    queryKey: [
      'getPrmotion',
      promotionStore.pageNumber,
      promotionStore.pageSize,
      promotionStore.title,
      promotionStore.startDate,
      promotionStore.endDate,
    ],
    queryFn: () =>
      promotionApi.getPromotion({
        pageNumber: promotionStore.pageNumber,
        pageSize: promotionStore.pageSize,
        name: promotionStore.title!,
        fromDate: promotionStore.startDate!,
        toDate: promotionStore.endDate!,
      }),
  });

  const handleAddPromotion = () => {
    promotionStore.setIsOpenAddEditPromotion(true);
  };

  const handleDateChange = (values: any) => {
    if (values) {
      promotionStore.setStartDate(new Date(values[0]));
      promotionStore.setEndDate(new Date(values[1]));
    } else {
      promotionStore.setStartDate(null);
      promotionStore.setEndDate(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    promotionStore.setTitle(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    promotionStore.setPageNumber(page);
    promotionStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    promotionStore.setTitle(null);
  }, []);

  return (
    <main>
      <div className={cn('promotion__head')}>
        <Typography.Title level={3}>Акции</Typography.Title>
        <div className={cn('promotion__filter')}>
          <DatePicker.RangePicker
            className={cn('promotion__datePicker')}
            onChange={handleDateChange}
          />
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className={cn('promotion__search')}
          />
          <Button
            onClick={handleAddPromotion}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый Акции
          </Button>
        </div>
      </div>

      <DataTable
        columns={promotionColumns}
        data={promotionData?.promotionList || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: promotionData?.count,
          current: promotionStore?.pageNumber,
          pageSize: promotionStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(promotionData?.count),
        }}
      />

      {promotionStore.isOpenAddEditPromotion && <AddEditPromotionModal />}
    </main>
  );
});
