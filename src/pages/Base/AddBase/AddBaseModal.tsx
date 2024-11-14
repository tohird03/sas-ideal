import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import {RcFile} from 'antd/es/upload';
import {UploadFileStatus} from 'antd/es/upload/interface';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {basesStore} from '@/stores/base/base';
import {addNotification} from '@/utils';
import {trimValues} from '@/utils/trimObjectFunc';
import styles from '../base.scss';

const cn = classNames.bind(styles);

export const AddBasesModal = observer(() => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);


  const {data: unitData} = useQuery({
    queryKey: ['pmsUnitGet'],
    queryFn: () => basesStore.pmsUnitGet(),
  });

  const {data: baseCategoryData} = useQuery({
    queryKey: ['baseCategoryGet'],
    queryFn: () => basesStore.baseCategoryGet(),
  });

  const previewImageMemo = useMemo(() => previewImage, [previewImage]);

  const {mutate: editBaseMutation} = useMutation({
    mutationFn: (params: any) =>
      basesStore.editBases(params.id, params.formDataUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getBases']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const {mutate: addBaseMutation} = useMutation({
    mutationFn: (params: any) => basesStore.postBases(params.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getBases']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setLoading(false);
    },
  });

  const handleSubmit = async (values: any) => {
    const image = bannerFileList.map((file) => file.thumbUrl || file.url);
    const newImages = bannerFileList.filter(
      (file) => file.originFileObj && file.status !== 'done'
    );

    setLoading(true);
    const trimmedObject = trimValues(values);


    const formData = {
      baseCategoryId: trimmedObject.baseCategoryId,
      images: image,
      name: trimmedObject.name,
      unitId: trimmedObject.unitId,
    };

    const formDataUpdate = {
      baseCategoryId: trimmedObject.baseCategoryId,
      imagesToCreate: newImages.map(
        (file) => file.thumbUrl || file.originFileObj
      ),
      imagesToRemove,
      name: trimmedObject.name,
      unitId: trimmedObject.unitId,
    };

    if (basesStore.editBase) {
      editBaseMutation({id: basesStore.editBase.id, formDataUpdate});
    } else {
      addBaseMutation({formData});
    }
  };

  const handleModalClose = () => {
    basesStore.setIsOpenAddBaseModal(false);
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

  const filterOption = (
    input: string,
    option?: {label: string, value: string}
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const unitOptions = useMemo(
    () =>
      unitData?.unitList?.map((unit) => ({
        value: unit?.id,
        label: unit?.name,
      })),
    [unitData]
  );

  const baseCategoryOptions = useMemo(
    () =>
      baseCategoryData?.baseCategoryList?.map((category) => ({
        value: category?.id,
        label: category?.name,
      })),
    [baseCategoryData]
  );


  const handleRemove = (file: UploadFile) => {
    const imageUrl = file.url;

    if (imageUrl) {
      setImagesToRemove(prev => [...prev, imageUrl?.split(imgStages?.apiUrl)[1]]);
    }

    setBannerFileList(prevList => prevList.filter(item => item.uid !== file.uid));
  };

  useEffect(() => {
    if (basesStore?.editBase) {
      form.setFieldsValue(basesStore?.editBase);
      form.setFieldValue('unitId', basesStore.editBase?.unit?.id);
      form.setFieldValue(
        'baseCategoryId',
        basesStore.editBase?.baseCategory?.id
      );
      const fileList =
        basesStore.editBase?.images?.map((img, index) => ({
          uid: String(-index),
          name: `image-${index}`,
          status: 'done' as UploadFileStatus,
          url: `${imgStages?.apiUrl}${img}`,
        })) || [];

      setBannerFileList(fileList);
    }
  }, [basesStore?.editBase]);

  return (
    <>
      <Modal
        open={basesStore.isOpenAddBaseModal}
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
            rules={[{required: true}]}
            name="images"
          >
            <Upload
              onPreview={handlePreview}
              beforeUpload={handleBeforeUpload}
              onChange={handleImgChange}
              fileList={bannerFileList}
              onRemove={handleRemove}
              listType="picture-card"
              accept={UPLOAD_ACCEPT}
              multiple
            >
              <div>
                <PlusOutlined />
                <div style={{marginTop: '8px'}}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="name" rules={[{required: true}]}>
            <Input placeholder="Базовое имя" />
          </Form.Item>
          <Form.Item name="baseCategoryId" rules={[{required: true}]}>
            <Select
              showSearch
              placeholder="Выберите базовую категорию"
              optionFilterProp="children"
              filterOption={filterOption}
              options={baseCategoryOptions}
            />
          </Form.Item>
          <Form.Item name="unitId" rules={[{required: true}]}>
            <Select
              showSearch
              placeholder="Выбор базового блока"
              optionFilterProp="children"
              filterOption={filterOption}
              options={unitOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          className={cn('add_base_modal_img_preview')}
          src={previewImageMemo}
        />
      </Modal>
    </>
  );
});
