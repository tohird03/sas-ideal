import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal} from 'antd';
import {AxiosResponse} from 'axios';
import {useLocalStorage} from 'usehooks-ts';
import {sellerSaleAndOrderApi} from '@/api/seller';
import {ISellerAddProductToBasketParams} from '@/api/seller/sellerSaleAndOrder/types';
import {wmsProductsApi} from '@/api/wmsProducts';
import {IGetGeneratePartId} from '@/api/wmsProducts/types';
import {sellerProductStore} from '@/stores/seller';
import {addNotification} from '@/utils';

export const SaveToBasketModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [generatePartIdLocal, setGeneratePartIdLocal] = useLocalStorage<string | null>('partId', null);

  const {data: generatePartIdToNewProduct, isLoading: generatePartIdLoading} = useQuery({
    queryKey: ['getGeneratePartId'],
    queryFn: () => wmsProductsApi.getGeneratePartIdToNewProducts(),
    enabled: !generatePartIdLocal,
  });


  const {mutate: addToBasket, isPending: loading} =
  useMutation({
    mutationKey: ['addToBasket'],
    mutationFn: (params: ISellerAddProductToBasketParams) => sellerSaleAndOrderApi.addProductToBasket(params),
    onSuccess: (data: AxiosResponse) => {
      if (data?.status === 204) {
        queryClient.invalidateQueries({queryKey: ['getNewProducts']});
        addNotification('Успешное добавление товара в корзину');
        handleModalClose();
      }
    },
    onError: addNotification,
  });

  const handleFinishAdd = () => {
    form.submit();
  };

  const handleModalClose = () => {
    sellerProductStore.setSingleNewProduct(null);
    sellerProductStore.setIsOpenSaveToBasketNewProductModal(false);
  };

  const handleAddProductToBasket = (value: ISellerAddProductToBasketParams) => {
    addToBasket({
      quantity: value?.quantity!,
      productId: sellerProductStore?.singleNewProduct?.id!,
      partId: generatePartIdLocal!,
      fromWarehouse: false,
    });
  };

  useEffect(() => {
    if (generatePartIdToNewProduct?.id) {
      setGeneratePartIdLocal(generatePartIdToNewProduct?.id!);
    }
  }, [generatePartIdToNewProduct]);

  return (
    <Modal
      open={sellerProductStore?.isOpenSaveToBasketNewProductModal}
      onOk={handleFinishAdd}
      onCancel={handleModalClose}
      title="В корзинку"
      confirmLoading={loading}
      width={400}
      centered
    >
      <Form
        layout="vertical"
        onFinish={handleAddProductToBasket}
        form={form}
      >
        <Form.Item
          label="Part Id"
          name="partId"
          rules={[{required: true}]}
          initialValue={generatePartIdLocal || generatePartIdToNewProduct}
        >
          <Input
            style={{width: '100%'}}
            placeholder="Part Id"
            disabled
            defaultValue={generatePartIdLocal!}
          />
        </Form.Item>
        <Form.Item
          label="Сколько"
          name="quantity"
          rules={[{required: true}]}
        >
          <InputNumber style={{width: '100%'}} placeholder="Сколько" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
