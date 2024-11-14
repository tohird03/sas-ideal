import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {RcFile} from 'antd/es/upload';
import {IOptionType, IProductAdd} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {IPmsAddProduct} from '@/api/productmanager/tyes';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {categoriesStore} from '@/stores/categories';
import {modelStore} from '@/stores/model';
import {productListStore} from '@/stores/product_list/product_list';
import {providerStore} from '@/stores/provider/provider';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../product_list.module.css';

export const AddProductListModal = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filteredProductModelOptions, setFilteredProductModelOptions] = useState<{value: string, label: string}[]>([]);
  const [searchOptions, setSearchOptions] = useState<string>('');

  const [tissueColorOptions, setTissueColorOptions] = useState<IOptionType[]>([]);


  const {data: tissueData, isLoading: tissueLoading} = useQuery({
    queryKey: ['getTissueData', searchOptions],
    queryFn: () =>
      productManagerApi.getTissue({
        name: searchOptions,
        pageNumber: 1,
        pageSize: 20,
      }),
  });

  const {data: providerData} = useQuery({
    queryKey: ['getProcess', providerStore.pageNumber, providerStore.pageSize],
    queryFn: () =>
      providerStore.getProvider({
        pageNumber: providerStore.pageNumber,
        pageSize: providerStore.pageSize,
      }),
  });

  const {data: productCategoryDataSelect} = useQuery({
    queryKey: ['getCategorySelect'],
    queryFn: () =>
      categoriesStore.getCategorySelect(),
  });

  const {data: allDirections} = useQuery({
    queryKey: ['getAllDirectionsFunc'],
    queryFn: () =>
      productListStore.getAllDirections({
        pageNumber: providerStore.pageNumber,
        pageSize: providerStore.pageSize,
      }),
  });

  const {data: productModelDataSelect} = useQuery({
    queryKey: ['getModelSelect'],
    queryFn: () =>
      modelStore.getModelSelect(),
  });

  const handleSuccess = (data: any) => {
    if (data?.data?.id) {
      navigate(`/pms/workon/${data?.data?.id}/work-on`);
    }
  };

  const {mutate: addProductMutation} = useMutation({
    mutationFn: (params: IPmsAddProduct) => productListStore.postProductList(params),
    onSuccess: (data: any) => {
      handleSuccess(data);
      addNotification('Успешно добавлено нового продукт');
      handleModalClose();
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });


  const {mutate: editProductMutation} = useMutation({
    mutationFn: (params: IPmsAddProduct) =>
      productListStore.patchProductList(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductList']});
      addNotification('Успешно изменено продукт');
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const handleSubmit = (values: IProductAdd) => {
    setLoading(true);
    const image = bannerFileList.map(file => file.thumbUrl || file.url);
    const trimmedObject = trimValues(values);


    if (productListStore.editProductList) {

      editProductMutation({
        ...trimmedObject,
        id: productListStore.editProductList.id,
        quantity: 1,
        images: image,
        ...(trimmedObject?.tissueId && {tissueId: trimmedObject.tissueId}),
        ...(trimmedObject?.tissueColorId && {tissueColorId: trimmedObject.tissueColorId}),
        ...(trimmedObject?.directionId && {directionId: trimmedObject.directionId}),
        oldPriceFactor: {
          costPrice: trimmedObject?.costPrice,
          factoryPrice: trimmedObject?.factoryPrice,
          investorPrice: trimmedObject?.investorPrice,
          b2b: trimmedObject?.b2b,
          retailPrice: trimmedObject?.retailPrice,
        },
      });
    } else {
      addProductMutation({
        ...trimmedObject,
        quantity: 1,
        images: image,
        ...(trimmedObject?.tissueId && {tissueId: trimmedObject.tissueId}),
        ...(trimmedObject?.tissueColorId && {tissueColorId: trimmedObject.tissueColorId}),
        ...(trimmedObject?.directionId && {directionId: trimmedObject.directionId}),
        oldPriceFactor: {
          costPrice: trimmedObject?.costPrice,
          factoryPrice: trimmedObject?.factoryPrice,
          investorPrice: trimmedObject?.investorPrice,
          b2b: trimmedObject?.b2b,
          retailPrice: trimmedObject?.retailPrice,
        },
      });
    }
  };

  const handleModalClose = () => {
    productListStore.setIsOpenProductModal(false);
    productListStore.setSelectedCategory(null);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleBeforeUpload = () => false;

  const handleImgChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setBannerFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();

        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const filterOption = (input: string, option?: {label: string, value: string}) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const tissueOptions = useMemo(() => (
    tissueData?.tissueList?.map((t, i) => ({
      value: t?.id || '',
      label: t?.name || '',
      key: i,
    }))
  ), [tissueData]);

  const directionOptions = useMemo(() => (
    allDirections?.directionList?.map((t, i) => ({
      value: t?.id || '',
      label: t?.title || '',
      key: i,
    }))
  ), [allDirections]);

  const providerOptions = useMemo(() => (
    providerData?.providerList?.map((provider) => ({
      value: provider?.id,
      label: provider?.name,
    }))
  ), [providerData]);

  const productCategoryOptions = useMemo(() => (
    productCategoryDataSelect?.categoryList?.map((productCategory => ({
      value: productCategory?.id,
      label: productCategory?.title,
    })))
  ), [productCategoryDataSelect]);

  const productModelOptions = useMemo(() => (
    productModelDataSelect?.modelList?.map((productModel) => ({
      value: productModel?.id || '',
      label: productModel?.name,
    }))
  ), [productModelDataSelect]);

  const handleCategoryChange = (selectedCategoryId: string) => {
    productListStore.setSelectedCategory(selectedCategoryId);
    form.setFieldsValue({modelId: undefined});

    const relatedModels = productModelDataSelect?.modelList?.filter((model) =>
      model.category.id === selectedCategoryId) || [];

    const options = relatedModels.map((productModel) => ({
      value: productModel?.id || '',
      label: productModel?.name,
    }));

    setFilteredProductModelOptions(options);
  };

  useEffect(() => {
    if (productListStore.editProductList) {
      form.setFieldsValue({
        name: productListStore.editProductList.name,
        price: productListStore.editProductList.price,
      });
      form.setFieldValue('categoryId', productListStore.editProductList.category?.id);
      form.setFieldValue('providerId', productListStore.editProductList.provider?.id);
      form.setFieldValue('modelId', productListStore.editProductList.model?.id);
      form.setFieldValue('images', productListStore?.productIdData?.images);
      form.setFieldValue('tissueColorId', productListStore?.productIdData?.tissueColor?.id);
      form.setFieldValue('direction', productListStore?.productIdData?.direction);
    } else {
      form.resetFields();
      setBannerFileList([]);
    }

    if (!productListStore.selectedCategory) {
      setFilteredProductModelOptions(productModelOptions || []);
    }
  }, [productListStore.editProductList, form, productModelOptions]);


  const debounceFetcher = (value: string) => {
    setSearchOptions(value);
  };

  const tissueOncChange = (value: string) => {
    if (value) {
      const selectedTissue = tissueData?.tissueList?.find((el) => el?.id === value);

      form.setFieldValue('tissueColorId', []);

      setTissueColorOptions(selectedTissue?.tissueColors as any);
    } else {
      setTissueColorOptions([]);
    }
  };

  const tissueColorsOptions = useMemo(() => (
    tissueColorOptions?.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [tissueColorOptions]);

  return (
    <>
      <Modal
        open={productListStore.isOpenProductModal}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        centered
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={loading}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Изображение"
            rules={[{required: Boolean(!productListStore.editProductList)}]}
            name="images"
          >
            <Upload
              maxCount={1}
              onPreview={handlePreview}
              beforeUpload={handleBeforeUpload}
              onChange={handleImgChange}
              fileList={bannerFileList}
              listType="picture-card"
              accept={UPLOAD_ACCEPT}
            >
              {bannerFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div className={styles.product__list__upload}>
          Upload
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Имя продукта" rules={[{required: true}]} name="name">
            <Input placeholder="Имя продукта" />
          </Form.Item>
          <Form.Item label="Цена продукта" rules={[{required: true}]} name="price">
            <InputNumber
              placeholder="Цена продукта"
              style={{width: '100%'}}
              formatter={(value) => priceFormat(value!)}
            />
          </Form.Item>
          <div className={styles.tissueInfoWrapp}>
            <Form.Item
              label="Выберите Ткань"
              name=""
              style={{width: '100%'}}
            >
              <Select
                showSearch
                placeholder="Ткань"
                loading={tissueLoading}
                optionFilterProp="children"
                notFoundContent={tissueLoading ? <Spin size="small" /> : null}
                filterOption={filterOption}
                onSearch={debounceFetcher}
                options={tissueOptions}
                onChange={tissueOncChange}
              />
            </Form.Item>
            <Form.Item
              label="Выберите Цвет ткани"
              name="tissueColorId"
              style={{width: '100%'}}
            >
              <Select
                disabled={Boolean(!tissueColorOptions?.length)}
                showSearch
                placeholder="Цвет ткани"
                loading={tissueLoading}
                optionFilterProp="children"
                notFoundContent={tissueLoading ? <Spin size="small" /> : null}
                filterOption={filterOption}
                options={tissueColorsOptions}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Выберите поставщик"
            rules={[{required: true}]}
            name="providerId"
          >
            <Select
              showSearch
              placeholder="Выберите поставщик"
              optionFilterProp="children"
              filterOption={filterOption}
              options={providerOptions}
            />
          </Form.Item>
          <Form.Item
            label="Выберите угол продукта"
            rules={[{required: true}]}
            name="direction"
          >
            <Select
              showSearch
              placeholder="Выберите угол продукта"
              optionFilterProp="children"
              filterOption={filterOption}
              options={directionOptions}
            />
          </Form.Item>
          <Form.Item
            label="Выберите категория продукта"
            rules={[{required: true}]}
            name="categoryId"
          >
            <Select
              showSearch
              placeholder="Выберите категория продукта"
              optionFilterProp="children"
              filterOption={filterOption}
              options={productCategoryOptions}
              onChange={handleCategoryChange}
            />
          </Form.Item>
          <Form.Item
            label="Выберите модель продукта"
            rules={[{required: true}]}
            name="modelId"
          >
            <Select
              showSearch
              placeholder="Выберите модель продукта"
              optionFilterProp="children"
              filterOption={filterOption}
              options={filteredProductModelOptions}
              value={form.getFieldValue('modelId')}
              disabled={!filteredProductModelOptions.length}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          className={styles.product__list__upload__image__modal}
          src={previewImage}
        />
      </Modal>

    </>
  );
});
