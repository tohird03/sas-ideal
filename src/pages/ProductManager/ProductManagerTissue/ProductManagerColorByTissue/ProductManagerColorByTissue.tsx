
import './productmanagertissuecolor.scss';

import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Input, Typography} from 'antd';
import {DataTable} from '@/components/Datatable/datatable';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {tissueColorTableColumn} from './constant';
import {ProductManagerTissueColorAddEditModal} from './ProductManagerTissueColorAddEditModal';

export const ProductManagerColorByTissue = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const {id} = useParams();

  const {data: colorByTissueData, isLoading: loading} = useQuery({
    queryKey: ['getColorByTissue', id],
    queryFn: () => productManagerStore.getColorByTissue(id!),
  });

  const handleAdd = () => {
    productManagerStore.setIsOpenTissueColorAddEditModal(true);
    productManagerStore.setIsEditTissueColorProduct(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {};

  const handlePageChange = (page: number, pageSize: number | undefined) => {};


  useEffect(() => () => {
    console.log('sahifadan chiqildi');
  }, []);

  return (
    <main>
      <div className="product-manager__tissuecolor_head">
        <Typography.Title level={3}>Ткань цвет</Typography.Title>
        <div className="product-manager__tissuecolor_filter">
          {/* <Input
            placeholder="Введите текст для поиска"
            allowClear
            onChange={handleSearch}
            className="product-manager__tissuecolor_search"
          /> */}
          <Button
            onClick={handleAdd}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Создавать Ткань цвет
          </Button>
        </div>
      </div>

      <DataTable
        columns={tissueColorTableColumn}
        data={colorByTissueData?.tissueColors!}
        loading={loading}
        isMobile={isMobile}
        pagination={false}
        // pagination={{
        //   total: 1,
        //   current: 1,
        //   pageSize: 10,
        //   showSizeChanger: true,
        //   onChange: handlePageChange,
        //   ...getPaginationParams(1),
        // }}
      />
      {productManagerStore.isOpenTissueColorAddEditModal && <ProductManagerTissueColorAddEditModal />}
    </main>
  );
});
