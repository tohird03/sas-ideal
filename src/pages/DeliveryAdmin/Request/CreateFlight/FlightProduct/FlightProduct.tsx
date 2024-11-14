import React from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {MinusOutlined, PartitionOutlined, PlusOutlined} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {Button, Card, Checkbox, ColorPicker, Image, Pagination, PaginationProps, Typography} from 'antd';
import classNames from 'classnames/bind';
import {requestApi} from '@/api/dmsRequest';
import {imgStages} from '@/api/endpoints';
import {IProductList} from '@/api/product_list/types';
import {requestStore} from '@/stores/dms';
import {addNotification} from '@/utils';
import styles from '../create-flight.scss';
import {FlightProductSkeleton} from './FlightProduct.Skeleton';

const cn = classNames.bind(styles);

export const FlightProduct = observer(() => {
  const {requestId} = useParams();

  const {data: singleRequestProducts, isLoading: singleRequestProductsLoading} = useQuery({
    queryKey: [
      'getSingleRequestProducts',
      requestId,
      requestStore.createFlightProductPageNumber,
      requestStore.createFlightProductPageSize,
    ],
    queryFn: () => requestId ? requestApi.getRequestProducts({
      requestId,
      pageNumber: requestStore.createFlightProductPageNumber,
      pageSize: requestStore.createFlightProductPageSize,
    }) : null,
  });

  const handleProductSplit = (product: IProductList) => {
    requestStore.setSingleCreateFlightProduct(product);
    requestStore.setIsOpenProductSplitModal(true);
  };

  const handleChooseProduct = (e: any, product: IProductList) => {
    if (e.target.checked) {
      requestStore?.setCreateFlightProducts([
        ...requestStore.createFlightProducts,
        {productId: product?.id!, count: product?.count || 1},
      ]);
    } else {
      const filterUnCheckedProduct = requestStore.createFlightProducts.filter(checkProduct => checkProduct?.productId !== product?.id!);

      requestStore.setCreateFlightProducts(filterUnCheckedProduct);
    }
  };

  const handleCreateFlightProductPaginationChange: PaginationProps['onChange'] = (pageNumber, pageSize: number) => {
    requestStore.setCreateFlightProductPageNumber(pageNumber);
    requestStore.setCreateFlightProductPageSize(pageSize);
  };

  const handleMinusQtyForCheckProduct = (productRequestId: string) => {
    const findMinusQtyProduct = requestStore.createFlightProducts?.find(checkProduct => checkProduct?.productId === productRequestId);

    if (!findMinusQtyProduct) {
      addNotification('Что-то пошло не так. Повторите попытку или перезагрузите страницу.');

      return;
    }

    const updateCheckProducts = requestStore?.createFlightProducts?.map(checkProduct => {
      if (checkProduct?.productId === findMinusQtyProduct?.productId) {
        return {
          ...checkProduct,
          count: checkProduct?.count - 1,
        };
      } else {
        return checkProduct;
      }
    });

    requestStore?.setCreateFlightProducts(updateCheckProducts);
  };

  const handlePlusQtyForCheckProduct = (productId: string) => {
    const findMinusQtyProduct = requestStore.createFlightProducts?.find(checkProduct => checkProduct?.productId === productId);

    if (!findMinusQtyProduct) {
      addNotification('Что-то пошло не так. Повторите попытку или перезагрузите страницу.');

      return;
    }

    const updateCheckProducts = requestStore?.createFlightProducts?.map(checkProduct => {
      if (checkProduct?.productId === findMinusQtyProduct?.productId) {
        return {
          ...checkProduct,
          count: checkProduct?.count + 1,
        };
      } else {
        return checkProduct;
      }
    });

    requestStore?.setCreateFlightProducts(updateCheckProducts);
  };

  const isFindCheckProduct = (id: string) => {
    const findCheckedProduct = requestStore?.createFlightProducts?.find(checkProduct => checkProduct?.productId === id);

    return findCheckedProduct;
  };

  return (
    <div className={cn('create-flight__product-wrapper')}>
      <Card className={cn('create-flight__product')}>
        <div className={cn('create-flight__product-header')}>
          <Typography.Title
            level={4}
          >
                Продукты
          </Typography.Title>
          <Typography.Title
            level={4}
            className={cn('create-flight__product-count')}
          >
            {singleRequestProducts?.count}
          </Typography.Title>
        </div>

        <div className={cn('create-flight__product-card-wrapper')}>
          {singleRequestProductsLoading
            ? <FlightProductSkeleton />
            : (
              singleRequestProducts?.requestsProductList?.map(product => (
                <div className={cn('create-flight__product-wrapper-withIcon')} key={`${product?.id}-${product?.requestsProductId}`}>
                  <div>
                    {product?.count! > 1 && (
                      <PartitionOutlined
                        className={cn('create-flight__product-card-icon')}
                        onClick={handleProductSplit.bind(null, product)}
                      />
                    )
                    }

                    <Checkbox
                      checked={Boolean(isFindCheckProduct(product?.id!))}
                      onClick={(event) => handleChooseProduct(event, product)}
                    />
                  </div>
                  <Card
                    className={
                      cn(`create-flight__product-card 
                      ${isFindCheckProduct(product?.id!) && 'create-flight__checked-product-card'}`)}
                  >
                    <div className={cn('create-flight__product-card-info')}>
                      <div className={cn('create-flight__product-card-product')}>
                        <Image
                          width={80}
                          height={50}
                          src={`${imgStages?.apiUrl}${product?.images[0]}`}
                          className={cn('create-flight__product-card-img')}
                        />
                        <div>
                          <Typography.Paragraph className={cn('create-flight__product-card-desc')}>
                            {product?.name}
                          </Typography.Paragraph>
                          <Typography.Paragraph className={cn('create-flight__product-card-desc')}>
                            {product?.model?.name} - {product?.direction?.title}
                          </Typography.Paragraph>
                        </div>
                      </div>
                      <div className={cn('create-flight__product-card-product')}>
                        <div>
                          <Typography.Paragraph className={cn('create-flight__product-card-desc')}>
                            {product?.tissue?.tissue?.name}
                          </Typography.Paragraph>
                          <Typography.Paragraph className={cn('create-flight__product-card-desc')}>
                            {product?.tissue?.name}
                          </Typography.Paragraph>
                        </div>
                        <ColorPicker disabled defaultValue={product?.tissue?.hexColor} />
                      </div>
                      <div className={cn('create-flight__product-card-count')}>
                        <Button
                          disabled={
                            !isFindCheckProduct(product?.id!)
                            || isFindCheckProduct(product?.id!)?.count === 1
                          }
                          icon={<MinusOutlined />}
                          onClick={handleMinusQtyForCheckProduct.bind(null, product?.id!)}
                        />
                        <Button>{`${
                          isFindCheckProduct(product?.id!)
                            ? isFindCheckProduct(product?.id!)?.count
                            : product?.count} / ${product?.count}`}
                        </Button>
                        <Button
                          disabled={
                            !isFindCheckProduct(product?.id!)
                            || isFindCheckProduct(product?.id!)?.count === product?.count
                          }
                          icon={<PlusOutlined />}
                          onClick={handlePlusQtyForCheckProduct.bind(null, product?.id!)}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )
          }
        </div>
        <Pagination
          className={cn('create-flight__pagination')}
          onChange={handleCreateFlightProductPaginationChange}
          total={singleRequestProducts?.count || 0}
          showTotal={(total) => `Общее количество: ${total}`}
          current={requestStore.createFlightProductPageNumber}
          pageSize={requestStore.createFlightProductPageSize}
          showSizeChanger
        />
      </Card>
    </div>
  );
});
