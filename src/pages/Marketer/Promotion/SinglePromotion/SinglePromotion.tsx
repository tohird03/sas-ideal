import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EditOutlined, FilterOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import classNames from 'classnames';
import {promotionApi} from '@/api/promotion';
import {IPromotionProducts} from '@/api/promotion/types';
import {DataTable} from '@/components/Datatable/datatable';
import {promotionStore} from '@/stores/marketer';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {AddEditPromotionModal} from '../AddEditPromotionModal';
import {promotionColumns} from '../constants';
import {AddProductModal} from './AddProductModal';
import {singlePromotionProductColumns} from './constants';
import {PromotionValueModal} from './PromotionValueModal';
import styles from './single-promotion.scss';
import {SinglePromotionProductsFilterModal} from './SinglePromotionProductsFilterModal';

const cn = classNames.bind(styles);

export const SinglePromotion = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {promotionId} = useParams();

  const {data: singlePromotion, isLoading: loading} = useQuery({
    queryKey: ['singlePromotion', promotionId],
    queryFn: () => promotionId ? promotionApi.getSinglePromotion(promotionId) : null,
  });

  const {data: promotionProductsData, isLoading: applicationProductsLoading} =
      useQuery({
        queryKey: [
          'getSinglePromotionProducts',
          promotionStore.promotionProductPageNumber,
          promotionStore.promotionProductPageSize,
          promotionStore.promotionProductName,
          promotionId,
          promotionStore.promotionProductFilter,
        ],
        queryFn: () => promotionId
          ? promotionApi.getPromotionProducts({
            pageNumber: promotionStore.promotionProductPageNumber,
            pageSize: promotionStore.promotionProductPageSize,
            name: promotionStore.promotionProductName!,
            promotionId: promotionId!,
            ...promotionStore.promotionProductFilter,
          }) : null,
      });

  const handleOpenFilterModal = () => {
    promotionStore.setIsOpenSinglePromotionProductsFilter(true);
  };

  const handleUpdateProducts = () => {
    promotionStore.setIsOpenPromotionValueModal(true);
  };

  const handleAddProduct = () => {
    promotionStore.setIsOpenAddProductModal(true);
  };

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    promotionStore.setPromotionProductName(e.currentTarget.value.trim());
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    promotionStore.setPageNumber(page);
    promotionStore.setPageSize(pageSize!);
  };

  function filterUniqueObjects(array: IPromotionProducts[]) {
    const seenIds = new Set();

    return array.filter(obj => {
      if (!seenIds.has(obj.id)) {
        seenIds.add(obj.id);

        return true;
      }

      return false;
    });
  }

  function filterUniqueString(array: React.Key[]) {
    const seenIds = new Set();

    return array.filter(obj => {
      if (!seenIds.has(obj)) {
        seenIds.add(obj);

        return true;
      }

      return false;
    });
  }

  const onSelectChange = (
    selectedRowKeysId: React.Key[],
    selectedRows: IPromotionProducts[]
  ) => {
    const uniqueSelectedKeys = filterUniqueString(selectedRowKeysId);
    const uniqueSelectedProducts = filterUniqueObjects(selectedRows);

    promotionStore.setPromotionProductUpdateSelectedProductsKeys(uniqueSelectedKeys);
    promotionStore.setPrmotionUpdateProducts(uniqueSelectedProducts);
  };

  const rowSelection = {
    selectedRowKeys: promotionStore.promotionProductUpdateSelectedProductsKeys,
    onChange: onSelectChange,
  };

  useEffect(() => () => {
    promotionStore.setPromotionProductName(null);
  }, []);

  useEffect(() => {
    if (promotionProductsData?.promotionList) {
      promotionStore?.setOldAddProductList(promotionProductsData?.promotionList?.map(productList => productList?.product));
    }
  }, [promotionProductsData]);

  return (
    <>
      <Typography.Title level={3}>Акции</Typography.Title>

      <DataTable
        columns={promotionColumns}
        data={[singlePromotion]}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
      />


      <div className={cn('single-promotion__head')}>
        <Typography.Title level={3}>Продукты</Typography.Title>
        <div className={cn('single-promotion__filter')}>
          <Button
            icon={<EditOutlined />}
            onClick={handleUpdateProducts}
            disabled={!(promotionStore?.prmotionUpdateProducts?.length! > 0)}
          >
            Скидка на обновление продуктов
          </Button>
          <Button
            icon={<FilterOutlined />}
            onClick={handleOpenFilterModal}
          >
            Фильтр
          </Button>
          <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearchName}
            className={cn('single-promotion__search')}
          />
          <Button
            onClick={handleAddProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Новый Продукты
          </Button>
        </div>
      </div>

      <DataTable
        isMobile={isMobile}
        loading={applicationProductsLoading}
        data={promotionProductsData?.promotionList || []}
        columns={singlePromotionProductColumns}
        pagination={{
          total: promotionProductsData?.count,
          current: promotionStore?.promotionProductPageNumber,
          pageSize: promotionStore?.promotionProductPageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(promotionProductsData?.count),
        }}
        rowSelection={rowSelection}
        rowKey="id"
      />

      {promotionStore.isOpenAddEditPromotion && <AddEditPromotionModal />}
      {promotionStore.isOpenAddProductModal && <AddProductModal />}
      {promotionStore.isOpenPromotionValueModal && <PromotionValueModal />}
      {promotionStore.isOpenSinglePromotionProductsFilter && <SinglePromotionProductsFilterModal />}
    </>
  );
});
