import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {RcFile} from 'antd/es/upload';
import classnamesBind from 'classnames/bind';
import {imgStages} from '@/api/endpoints';
import {IOptionType, IProductAdd} from '@/api/product_list/types';
import {productManagerApi} from '@/api/productmanager/productmanager';
import {IPmsAddProduct, IProductMinPrice} from '@/api/productmanager/tyes';
import {IUser} from '@/api/users/types';
import {usersApi} from '@/api/users/users';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {categoriesStore} from '@/stores/categories';
import {modelStore} from '@/stores/model';
import {productListStore} from '@/stores/product_list/product_list';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';
import {providerStore} from '@/stores/provider/provider';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../../../Product/product_list.module.css';

const cn = classnamesBind.bind(styles);

const filterOption = (input: string, option?: {label: string, value: string}) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const ProductManagerAddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>();
  const [filteredProductModelOptions, setFilteredProductModelOptions] = useState<{value: string, label: string}[]>([]);
  const [tissueColorOptions, setTissueColorOptions] = useState<IOptionType[]>([]);
  const [searchOptions, setSearchOptions] = useState<string>('');

  const [costPrice, setCostPrice] = useState<number>(0);
  const [factoryPrice, setFactoryPrice] = useState<number>(0);
  const [investorPrice, setInvestorPrice] = useState<number>(0);
  const [b2b, setB2b] = useState<number>(0);
  const [retailDetails, setRetailDetails] = useState<number>(0);

  const [costPriceRes, setCostPriceRes] = useState<number>(0);
  const [factoryPriceRes, setFactoryPriceRes] = useState<number>(0);
  const [investorPriceRes, setInvestorPriceRes] = useState<number>(0);
  const [b2bRes, setB2bRes] = useState<number>(0);
  const [retailDetailsRes, setRetailDetailsRes] = useState<number>(0);

  // GET DATAS AND POST
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
    queryKey: ['getProviders'],
    queryFn: () =>
      usersApi.getProvider({
        pageNumber: 1,
        pageSize: 1000,
      }),
  });

  const {data: allDirections} = useQuery({
    queryKey: ['getAllDirectionsFunc'],
    queryFn: () =>
      productListStore.getAllDirections({
        pageNumber: providerStore.pageNumber,
        pageSize: providerStore.pageSize,
      }),
  });

  const {data: productCategoryDataSelect} = useQuery({
    queryKey: ['getCategorySelect'],
    queryFn: () =>
      categoriesStore.getCategorySelect(),
  });

  const {data: productModelDataSelect} = useQuery({
    queryKey: ['getModelSelect'],
    queryFn: () =>
      modelStore.getModelSelect(),
  });

  const {mutate: addProductMutation} = useMutation({
    mutationFn: (params: IPmsAddProduct) => productListStore.postPmsProductList(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getPmProductList']});
      addNotification('Продукт создан');

      handleModalClose();
    },
    onError: addNotification,
    onSettled: () => {
      setLoading(false);
    },
  });

  const {mutate: editProductMutation} = useMutation({
    mutationFn: (params: IPmsAddProduct) => productListStore.patchProductList(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getPmProductList']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  // PRODUCT INFO FORM
  const handleProductSubmit = () => {
    setLoading(true);
    form.submit();
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    productListStore.setEditProduct(null);
    productManagerStore.setIsProductManagerModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleSubmit = (values: IProductAdd) => {
    setLoading(true);
    const image = bannerFileList.map(file => file.thumbUrl || file.url);
    const trimmedObject = trimValues(values);


    if (productListStore.editProductList) {

      editProductMutation({
        ...trimmedObject,
        id: productListStore.editProductList.id,
        quantity: 1,
        price: 1,
        images: image,
        oldPriceFactor: {
          costPrice: trimmedObject?.costPrice,
          factoryPrice: trimmedObject?.factoryPrice,
          investorPrice: trimmedObject?.investorPrice,
          b2b: trimmedObject?.b2b,
          retailPrice: trimmedObject?.retailPrice,
        },
        spends: productManagerStore.createAddEditProductMinPriceSpends?.map(spend => ({
          spend: spend?.spend,
          description: spend?.description,
          spendTypeId: spend?.spendTypeId,
        })),
      });
    } else {
      addProductMutation({
        ...trimmedObject,
        quantity: 1,
        price: 1,
        images: image,
        oldPriceFactor: {
          costPrice: trimmedObject?.costPrice,
          factoryPrice: trimmedObject?.factoryPrice,
          investorPrice: trimmedObject?.investorPrice,
          b2b: trimmedObject?.b2b,
          retailPrice: trimmedObject?.retailPrice,
        },
        spends: productManagerStore.createAddEditProductMinPriceSpends?.map(spend => ({
          spend: spend?.spend,
          description: spend?.description,
          spendTypeId: spend?.spendTypeId,
        })),
      });
    }
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

  const handleCategoryChange = (selectedCategoryId: string) => {
    setSelectedCategory(selectedCategoryId);
    form.setFieldsValue({modelId: undefined});

    const relatedModels = productModelDataSelect?.modelList?.filter((model) =>
      model.category.id === selectedCategoryId) || [];

    const options = relatedModels.map((productModel) => ({
      value: productModel?.id || '',
      label: productModel?.name,
    }));

    setFilteredProductModelOptions(options);
  };

  const debounceFetcher = (value: string) => {
    setSearchOptions(value);
  };


  const tissueOncChange = (value: string) => {
    if (value) {
      const selectedTissue = tissueData?.tissueList?.find((el) => el?.id === value);

      form.setFieldValue('tissueColorId', []);

      setTissueColorOptions(selectedTissue?.tissueColors as any);
    }
  };


  // PRICE FACTOR CALC
  const handleCostPriceChange = (value: string | null) => {
    if (!value) {
      setCostPrice(0);

      return;
    }
    setCostPrice(parseInt(value, 10));
  };

  const handleFactoryPriceChange = (value: string | null) => {
    if (!value) {
      setFactoryPrice(0);

      return;
    }

    setFactoryPrice(parseInt(value, 10));
  };

  const handleInvestorPriceChange = (value: string | null) => {
    if (!value) {
      setInvestorPrice(0);

      return;
    }

    setInvestorPrice(parseInt(value, 10));
  };

  const handleB2BChange = (value: string | null) => {
    if (!value) {
      setB2b(0);

      return;
    }

    setB2b(parseInt(value, 10));
  };

  const handleRetailChange = (value: string | null) => {
    if (!value) {
      setRetailDetails(0);

      return;
    }

    setRetailDetails(parseInt(value, 10));
  };

  const handleCalculate = () => {
    const resultMargin = retailDetailsRes - b2bRes;
    const resultRetail = (resultMargin * 100) / retailDetailsRes;

    return {
      retailDiscountWithoutDiscounts: resultRetail,
      marginPrice: resultMargin,
    };
  };

  const handleAddMinPrice = () => {
    productManagerStore.setIsOpenCreateProductMinPriceModal(true);
  };

  // SELECT OPTIONS
  const providerOptions = useMemo(() => (
    providerData?.userList?.map((provider: IUser) => ({
      value: provider?.company?.id,
      label: `${provider?.firstName} ${provider?.lastName}`,
    }))
  ), [providerData]);

  const tissueOptions = useMemo(() => (
    tissueData?.tissueList?.map((t, i) => ({
      value: t?.id || '',
      label: t?.name || '',
      key: i,
    }))
  ), [tissueData]);

  const tissueColorsOptions = useMemo(() => (
    tissueColorOptions?.map((el, i) => ({
      value: el?.id,
      label: el?.name,
      key: i,
    }))
  ), [tissueColorOptions]);

  const directionOptions = useMemo(() => (
    allDirections?.directionList?.map((t, i) => ({
      value: t?.id,
      label: t?.title,
      key: i,
    }))
  ), [allDirections]);

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


  // INITIAL VALUES AND USEEFFECT
  useEffect(() => {
    if (productListStore.editProductList) {
      setBannerFileList([
        {
          uid: '-1',
          name: 'user.avatar',
          status: 'done',
          url: `${imgStages?.apiUrl}${productListStore.editProductList?.images}`,
        },
      ]);

      form.setFieldsValue({
        name: productListStore.editProductList.name,
        price: productListStore.editProductList.price,
        categoryId: productListStore.editProductList.category?.id,
        providerId: productListStore.editProductList.provider?.id,
        modelId: productListStore.editProductList.model?.id,
        tissueId: productListStore?.editProductList?.tissueColor?.tissue?.id,
        tissueColorId: productListStore?.editProductList?.tissueColor?.id,
        directionId: productListStore?.editProductList?.direction?.id,
        countDay: productListStore?.editProductList?.countDay,
        costPrice: productListStore?.editProductList?.oldPriceFactor?.costPrice,
        factoryPrice: productListStore?.editProductList?.oldPriceFactor?.factoryPrice,
        investorPrice: productListStore?.editProductList?.oldPriceFactor?.investorPrice,
        b2b: productListStore?.editProductList?.oldPriceFactor?.b2b,
        retailPrice: productListStore?.editProductList?.oldPriceFactor?.retailPrice,
      });

      setCostPrice(productListStore?.editProductList?.oldPriceFactor?.costPrice!);
      setFactoryPrice(productListStore?.editProductList?.oldPriceFactor?.factoryPrice!);
      setInvestorPrice(productListStore?.editProductList?.oldPriceFactor?.investorPrice!);
      setB2b(productListStore?.editProductList?.oldPriceFactor?.b2b!);
      setRetailDetails(productListStore?.editProductList?.oldPriceFactor?.retailPrice!);

      const spends: IProductMinPrice[] = productListStore?.editProductList?.spends?.map((spend, index) => ({
        spend: spend?.spend,
        spendTypeId: spend?.spendType?.id,
        spendTypeName: spend?.spendType?.name,
        description: spend?.description,
        id: index,
      }));

      productManagerStore.setCreateProductMinPrice(productListStore?.editProductList?.minPrice);
      productManagerStore.setCreateAddEditProductMinPriceSpends(spends);
    } else {
      form.resetFields();
      setBannerFileList([]);
    }

    if (!selectedCategory) {
      setFilteredProductModelOptions(productModelOptions || []);
    }
  }, [productListStore.editProductList, form]);

  useEffect(() => {
    const cPrice = costPrice;
    const fmPrice = costPrice + costPrice * (factoryPrice / 100);
    const inMPrice = fmPrice + fmPrice * (investorPrice / 100);
    const b2bPrice = inMPrice + inMPrice * (b2b / 100);
    const retailDPrice = retailDetails;

    setCostPriceRes(cPrice);
    setFactoryPriceRes(fmPrice);
    setInvestorPriceRes(inMPrice);
    setB2bRes(b2bPrice);
    setRetailDetailsRes(retailDPrice);
  },
  [
    costPrice,
    factoryPrice,
    investorPrice,
    b2b,
    retailDetails,
  ]);

  return (
    <>
      <Modal
        open={productManagerStore.isProductAddManagerModal}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        centered
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={loading}
        width={1000}
      >
        <Row gutter={24}>
          <Col xl={12} lg={12} md={14} xs={24}>
            <Form
              form={form}
              onFinish={handleProductSubmit}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Изображение"
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

              <div className={styles.tissueInfoWrapp}>
                <Form.Item
                  label="Выберите Ткань"
                  name="tissueId"
                  style={{width: '100%'}}
                  rules={[{required: true}]}
                >
                  <Select
                    showSearch
                    placeholder="Ткань"
                    loading={tissueLoading}
                    optionFilterProp="children"
                    notFoundContent={tissueLoading ? <Spin size="small" /> : null}
                    filterOption={filterOption}
                    onSearch={debounceFetcher}
                    options={[
                      ...(productListStore.editProductList
                        ? [{
                          value: productListStore.editProductList?.tissueColor?.tissue?.id!,
                          label: productListStore.editProductList?.tissueColor?.tissue?.name!,
                        }] : []),
                      ...(tissueOptions || []),
                    ]}
                    onChange={tissueOncChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Выберите Цвет ткани"
                  name="tissueColorId"
                  style={{width: '100%'}}
                  rules={[{required: true}]}
                >
                  <Select
                    disabled={Boolean(!tissueColorOptions?.length)}
                    showSearch
                    placeholder="Цвет ткани"
                    loading={tissueLoading}
                    optionFilterProp="children"
                    notFoundContent={tissueLoading ? <Spin size="small" /> : null}
                    filterOption={filterOption}
                    options={[
                      ...(productListStore.editProductList
                        ? [{
                          value: productListStore.editProductList?.tissueColor?.id!,
                          label: productListStore.editProductList?.tissueColor?.name!,
                        }] : []),
                      ...(tissueColorsOptions || []),
                    ]}
                  />
                </Form.Item>
              </div>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={24} xs={24}>
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
                      onChange={handleCategoryChange}
                      options={[
                        ...(productListStore.editProductList
                          ? [{
                            value: productListStore.editProductList?.category?.id,
                            label: productListStore.editProductList?.category?.title,
                          }] : []),
                        ...(productCategoryOptions || []),
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={24} xs={24}>
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
                      value={form.getFieldValue('modelId')}
                      disabled={!filteredProductModelOptions?.length}
                      options={[
                        ...(productListStore.editProductList
                          ? [{
                            value: productListStore.editProductList?.model?.id,
                            label: productListStore.editProductList?.model?.name,
                          }] : []),
                        ...(filteredProductModelOptions || []),
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Выберите поставщик"
                rules={[{required: true}]}
                name="providerId"
              >
                <Select
                  placeholder="Выберите поставщик"
                  options={[
                    ...(productListStore.editProductList
                      ? [{
                        value: productListStore.editProductList?.provider?.id,
                        label: productListStore.editProductList?.provider?.name,
                      }] : []),
                    ...(providerOptions || []),
                  ]}
                />
              </Form.Item>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} xs={24}>
                  <Form.Item
                    label="Выберите угол продукта"
                    name="directionId"
                  >
                    <Select
                      showSearch
                      placeholder="Выберите угол продукта"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={[
                        ...(productListStore.editProductList
                          ? [{
                            value: productListStore.editProductList?.direction?.id,
                            label: productListStore.editProductList?.direction?.title,
                          }] : []),
                        ...(directionOptions || []),
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} xs={24}>
                  <Form.Item
                    label="Считать день"
                    rules={[{
                      required: true,
                      validator: (rules, value) => parseFloat(value) > 0
                        ? Promise.resolve() : Promise.reject('Минимальное значение: 1'),
                    }]}
                    name="countDay"
                  >
                    <InputNumber
                      min={1}
                      placeholder="Считать день"
                      style={{width: '100%'}}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xl={12} lg={12} md={10} xs={24} >
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label={<Typography>Себестоимость</Typography>}
                rules={[{
                  required: true,
                  validator: (rules, value) => parseFloat(value) > 0
                    ? Promise.resolve() : Promise.reject('Минимальное значение: 1'),
                }]}
                name="costPrice"
                style={{marginBottom: '0px', marginTop: '10px'}}
              >
                <InputNumber
                  style={{width: '100%'}}
                  formatter={(value) => priceFormat(value!)}
                  placeholder="Себестоимость"
                  onChange={handleCostPriceChange}
                />
              </Form.Item>
              <Typography.Text
                className={cn('resultPrice')}
              >
                в резултате: {priceFormat(costPriceRes)}
              </Typography.Text>

              <Form.Item
                label={<Typography>Наценка фабрики %</Typography>}
                name="factoryPrice"
                initialValue={0}
                rules={[{
                  required: true,
                  validator: (rules, value) => parseFloat(value) >= 0
                    ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
                }]}
                style={{marginBottom: '0px', marginTop: '10px'}}
              >
                <InputNumber
                  min="0"
                  style={{width: '100%'}}
                  formatter={(value) => priceFormat(value!)}
                  placeholder="Наценка фабрики"
                  onChange={handleFactoryPriceChange}
                />
              </Form.Item>
              <Typography.Text
                className={cn('resultPrice')}
              >
              цена на этапе: {priceFormat(factoryPriceRes)}
              </Typography.Text>
              <Form.Item
                label={<Typography>Наценка инвестора %</Typography>}
                name="investorPrice"
                rules={[{
                  required: true,
                  validator: (rules, value) => parseFloat(value) >= 0
                    ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
                }]}
                initialValue={0}
                style={{marginBottom: '0px', marginTop: '10px'}}
              >
                <InputNumber
                  min="0"
                  style={{width: '100%'}}
                  formatter={(value) => priceFormat(value!)}
                  placeholder="Наценка инвестора"
                  onChange={handleInvestorPriceChange}
                />
              </Form.Item>
              <Typography.Text
                className={cn('resultPrice')}
              >
                в резултате: {priceFormat(investorPriceRes)}
              </Typography.Text>

              <Form.Item
                label={<Typography>Оптовая наценка %</Typography>}
                rules={[{
                  required: true,
                  validator: (rules, value) => parseFloat(value) >= 0
                    ? Promise.resolve() : Promise.reject('Минимальное значение: 0'),
                }]}
                name="b2b"
                initialValue={0}
                style={{marginBottom: '0px', marginTop: '10px'}}
              >
                <InputNumber
                  min="0"
                  style={{width: '100%'}}
                  formatter={(value) => priceFormat(value!)}
                  placeholder="Оптовая наценка"
                  onChange={handleB2BChange}
                />
              </Form.Item>
              <Typography.Text
                className={cn('resultPrice')}
              >в резултате: {priceFormat(b2bRes)}
              </Typography.Text>

              <Form.Item
                label={<Typography>Розничная цена</Typography>}
                rules={[{
                  required: true,
                  validator: (rules, value) => parseFloat(value) > 0
                    ? Promise.resolve() : Promise.reject('Минимальное значение: 1'),
                }]}
                name="retailPrice"
                style={{marginBottom: '0px', marginTop: '10px'}}
              >
                <InputNumber
                  style={{width: '100%'}}
                  formatter={(value) => priceFormat(value!)}
                  placeholder="Розничная цена"
                  onChange={handleRetailChange}
                />
              </Form.Item>
              <Typography.Text
                className={cn('resultPrice')}
              >
              в резултате: {retailDetailsRes > 0
                  ? handleCalculate().retailDiscountWithoutDiscounts
                  : 0} %
              </Typography.Text>
              <br />
              <Typography.Text
                className={cn('resultPrice')}
              >
              Маржа: {priceFormat(handleCalculate().marginPrice)}
              </Typography.Text>

              <Button
                className={cn('create-product__min-price')}
                onClick={handleAddMinPrice}
              >
                Минимальный расход: {priceFormat(productManagerStore.createProductMinPrice)} сум
              </Button>
            </Form>
          </Col>
        </Row>
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
