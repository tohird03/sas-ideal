import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {Button, Tabs, Typography} from 'antd';
import {Content} from 'antd/es/layout/layout';
import classNames from 'classnames';
import {productListStore} from '@/stores/product_list/product_list';
import {workOnStore} from '@/stores/workon';
import {WorkOnAddModal} from './AddProductovModal';
import {Carusel} from './Carusel';
import {WorkOnTabsItems} from './constants';
import {ProductImgUploadModal} from './ProductModalImgUploadModal/ProductModalImgUploadModal';
import {IWorkOnTabs} from './types';
import styles from './workon.scss';

const cn = classNames.bind(styles);

export const WorkOn = observer(() => {
  const {id} = useParams();
  const handleAddTabsModal = () => {
    workOnStore.setIsAddTabsModal(true);
  };

  const {data: productListData} = useQuery({
    queryKey: ['getProductListId'],
    queryFn: () => productListStore.getProdIdData(id!),
  });

  const onChangeTabs = (key: string) => {
    workOnStore.setIsTabsIndex(key as IWorkOnTabs.Product);
  };

  useEffect(() => {
    productListStore.setProductIdData(productListData!);
  }, [productListData, productListStore.productIdData]);

  const handleAddProductImg = () => {
    productListStore.setIsOpenProductUploadImgModal(true);
  };

  return (
    <>
      <Typography.Title level={3}>Работа над</Typography.Title>

      <Content className={cn('workon__content')}>
        <div className={cn('workon__content-left')}>
          <div className={cn('workon__content-card')}>
            <div>
              <Carusel />
              <Button
                style={{width: '100%'}}
                onClick={handleAddProductImg}
              >
                Добавить изображение
              </Button>
            </div>
            <div className={cn('workon__content-text__card')}>
              <div>
                <Typography.Title level={4}>
                  {productListStore?.productIdData?.name}
                </Typography.Title>
                <p>{productListStore?.productIdData?.category?.title}</p>
              </div>

              <div>
                <div className={cn('workon__content-text')}>
                  <p>Имя продавца</p>
                  <p>+998 90 123 45 67</p>
                </div>

                <div className={cn('workon__content-text')}>
                  <p>Имя клиента</p>
                  <p>+998 90 123 45 67</p>
                </div>

                <div className={cn('workon__content-text')}>
                  <p>Ткань</p>
                  <p>Ткань техт</p>
                </div>

                <div className={cn('workon__content-text')}>
                  <p>Общая стоимость</p>
                  <p>{productListStore?.productIdData?.price}</p>
                </div>

                <div>
                  <Typography.Title level={4}>
                    Заглавие
                  </Typography.Title>
                  <p className={cn('workon_content-text__title')}>
                    Мебель и предметы интерьера — то, с чем мы
                    сталкиваемся ежедневно. Знания лексики по теме
                    «Furniture» пригодятся во время похода в мебельный
                    магазин или магазин с бытовыми товарами, в
                    разговоре с домовладельцем и даже в бытовом
                    общении. В этой статье названия мебели и предметов
                    интерьера сгруппированы по комнатам.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="1"
            items={WorkOnTabsItems}
            onChange={onChangeTabs}
            tabBarExtraContent={<Button onClick={handleAddTabsModal}>Добавить</Button>}
          />
        </div>
        {/* <Card className={cn('workon__content-right')}>
          <WorkOnFile />
        </Card> */}
      </Content>

      {/* {workOn.isEditTabModal && <WorkOnProductTabsEditModal />} */}
      {productListStore.isOpenProductImdUploadModal && <ProductImgUploadModal /> }
      {workOnStore.isAddTabsModal && <WorkOnAddModal />}
    </>
  );
});
