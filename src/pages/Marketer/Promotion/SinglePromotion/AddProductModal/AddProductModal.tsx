import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {SearchOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Checkbox, Input, Modal, Typography} from 'antd';
import classnamesBind from 'classnames/bind';
import {IProductList} from '@/api/product_list/types';
import {DataTable} from '@/components/Datatable/datatable';
import {promotionStore} from '@/stores/marketer';
import {pmProductListStore} from '@/stores/pmPRoduct';
import {getPromotionPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {addProductColumns} from '../constants';
import styles from '../single-promotion.scss';

const cn = classnamesBind.bind(styles);

export const AddProductModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [selectedRowsData, setSelectedRowsData] = useState<IProductList[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [oldAddProductFilter, setOldAddProductFilter] = useState<IProductList[]>([]);

  const {data: productListData, isLoading: loading} = useQuery({
    queryKey: ['getPmProductList',
      promotionStore.promotionAddPmsProductPageNumber,
      promotionStore.promotionAddPmsProductPageSize,
      promotionStore.promotionAddPmsProductName],
    queryFn: () =>
      pmProductListStore.getPmProductList({
        pageSize: promotionStore.promotionAddPmsProductPageSize,
        pageNumber: promotionStore.promotionAddPmsProductPageNumber,
        name: promotionStore.promotionAddPmsProductName!,
      }),
  });

  function filterUniqueObjects(array: IProductList[]) {
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
    selectedRows: IProductList[]
  ) => {
    const uniqueSelectedKeys = filterUniqueString(selectedRowKeysId);
    const uniqueSelectedProducts = filterUniqueObjects(selectedRows);

    setSelectedRowKeys(uniqueSelectedKeys);
    setSelectedRowsData(uniqueSelectedProducts);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleModalOk = () => {
    promotionStore.setPromotionProducts(selectedRowsData);
    promotionStore.setIsOpenPromotionValueModal(true);
  };

  const handleModalClose = () => {
    setSelectedRowKeys([]);
    promotionStore.setIsOpenAddProductModal(false);
  };

  const handleSearchAppProducts = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    promotionStore.setPromotionAddPmsProductName(e.target.value.trim());
  };


  const handlePageChange = (page: number, pageSize: number | undefined) => {
    promotionStore.setPromotionAddPmsProductPageSize(pageSize!);
    promotionStore.setPromotionAddPmsProductPageNumber(page);
  };

  useEffect(() => {
    const filterProducts = productListData?.productList?.filter(product => {
      const findOldAddProduct = promotionStore?.oldAddProductList?.find(oldProduct => oldProduct?.id === product?.id);

      if (!findOldAddProduct) {
        return product;
      }
    });

    setOldAddProductFilter(filterProducts!);
  }, [productListData?.productList]);

  return (
    <Modal
      open={promotionStore.isOpenAddProductModal}
      onOk={handleModalOk}
      onCancel={handleModalClose}
      title={'Продукты на складе'}
      centered
      width={'1200px'}
      footer={
        <>
          <div className={cn('single-promotion__add-product-footer')}>
            <span>
              <Checkbox checked={Boolean(selectedRowKeys?.length)} /> &nbsp;
              <Typography.Text>
                Выбрали {selectedRowKeys?.length} шт
              </Typography.Text>
            </span>
            <Button
              type={'primary'}
              disabled={Boolean(!selectedRowsData?.length)}
              onClick={handleModalOk}
            >
              Сохранить
            </Button>
          </div>
        </>
      }
    >
      <div className={cn('single-promotion__search-wrapper')}>
        <Input
          placeholder="введите текст для поиска"
          onChange={handleSearchAppProducts}
          addonAfter={<SearchOutlined />}
        />
      </div>
      <DataTable
        isMobile={isMobile}
        loading={loading}
        data={oldAddProductFilter || []}
        columns={addProductColumns}
        pagination={{
          total: productListData?.count,
          current: productListData?.pageNumber,
          pageSize: productListData?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPromotionPaginationParams(oldAddProductFilter?.length, productListData?.pageSize),
        }}
        rowSelection={rowSelection}
        rowKey="id"
      />
    </Modal>
  );
});
