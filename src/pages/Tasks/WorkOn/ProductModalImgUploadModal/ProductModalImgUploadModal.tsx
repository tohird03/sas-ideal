import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {PlusOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
// import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Form,
  Modal,
  Upload,
  UploadFile,
} from 'antd';
import {RcFile, UploadProps} from 'antd/es/upload';
import {IProductImgUploadWorkOn, IProductUpdateWorkOn} from '@/api/product_list/types';
import {UPLOAD_ACCEPT} from '@/pages/Home/constants';
import {productListStore} from '@/stores/product_list/product_list';
import {addNotification} from '@/utils';
// import styles from '../product_list.module.css';

export const ProductImgUploadModal = observer(() => {
  const {id} = useParams();
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const queryClient = useQueryClient();
  const [modalLoading, setModalLoading] = useState(false);

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

  const handleBeforeUpload = () => false;

  const handleImgChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setBannerFileList(newFileList);
  };

  const {mutate: updateProductWorkOn} = useMutation({
    mutationFn: (params: IProductUpdateWorkOn) => productListStore.patchProductUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setModalLoading(false);
    },
  });

  const handleSubmit = () => {
    setModalLoading(true);

    const image = bannerFileList.map(file => file.thumbUrl || file.url);

    updateProductWorkOn({imagesToCreate: image, productId: id!});

    console.log('handle submit', image);
  };

  const handleModalClose = () => {
    productListStore.setIsOpenProductUploadImgModal(false);
  };

  return (
    <>
      <Modal
        open={productListStore.isOpenProductImdUploadModal}
        onCancel={handleModalClose}
        onOk={handleSubmit}
        centered
        width={500}
        confirmLoading={modalLoading}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
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
              listType="picture-card"
              accept={UPLOAD_ACCEPT}
            >
              <div>
                <PlusOutlined />
                <div >
                    Upload
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
        <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            src={previewImage}
            style={{width: '100%', height: '100%'}}
          />
        </Modal>
      </Modal>
    </>
  );
});
