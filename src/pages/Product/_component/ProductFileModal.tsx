import React from 'react';
import {observer} from 'mobx-react';
import {Divider, Form, Image, List, Modal} from 'antd';
import {productListStore} from '@/stores/product_list/product_list';

export const ProductFileModal = observer(() => {
  const [form] = Form.useForm();

  const handleModalClose = () => {
    productListStore.setIsOpenFileModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  return (
    <Modal
      open={productListStore.isOpenFileModal}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      centered
    >
      <Divider orientation="left">Файлы</Divider>
      <List
        bordered
        dataSource={[]}
        renderItem={(item) => (
          <List.Item>
            <Image
              width={200}
              height={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </List.Item>
        )}
      />
    </Modal>
  );
});
