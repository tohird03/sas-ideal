import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {
  Button,
  Col,
  Popconfirm,
  Row,
} from 'antd';
import {IProductList} from '@/api/product_list/types';
import {productListStore} from '@/stores/product_list/product_list';

type Props = {
  data: IProductList;
};

export const ProductListAction= observer(({data}: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    productListStore.deleteProductList(data?.id)
      .then(() => {
        queryClient.invalidateQueries({queryKey: ['getProductList']});
      });
  }, [productListStore, queryClient]);

  const handleFileOpen = () => {
    productListStore.setIsOpenFileModal(true);
  };

  const handleMoreOpenPage = () => {
    productListStore.setProductId(data.id);
    navigate(`/pms/workon/${data.id}/work-on`);
  };

  const handleEditModal = () => {
    productListStore.setProductIdData(null);
    productListStore.setIsOpenProductModal(true);
    productListStore.setEditProduct(data);
  };

  return (
    <Row>
      <Col span={6}>
        <Button
          onClick={handleFileOpen}
          type="primary"
          icon={<FileOutlined />}
        />
      </Col>

      <Col span={6}>
        <Button
          onClick={handleEditModal}
          type="primary"
          icon={<EditOutlined />}
        />
      </Col>

      <Col span={6}>
        <Popconfirm
          title="Удалить пользователя"
          description="Вы уверены, что хотите удалить этого пользователя?"
          onConfirm={handleDelete}
          okText="Да"
          okButtonProps={{style: {background: 'red'}}}
          cancelText="Нет"
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>

      </Col>

      <Col span={6}>
        <Button
          onClick={handleMoreOpenPage}
          type="primary"
          icon={<MoreOutlined />}
        />
      </Col>
    </Row>
  );
});
