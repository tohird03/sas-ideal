import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {IGetCategoryManagerPricing} from '@/api/productmanager/tyes';
import {productManagerStore} from '@/stores/productManager/tissue/productManagerStore';

type Props = {
  pricing: IGetCategoryManagerPricing[];
};

export const ProductManagerPricingActions: FC<Props> = observer(({pricing}) => {
  const queryClient = useQueryClient();

  const handleEditPricing = () => {
    productManagerStore.setIsProductManagerPricingModal(true);
    productManagerStore.setIsProductManagerPricingSingle(pricing);
  };

  const handleDelete = () => {
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditPricing} type="primary" icon={<EditOutlined />} />
      {/* <Popconfirm
        title="Удалить ценаобразования"
        description="Вы уверены, что хотите удалить этого ценаобразования?"
        onConfirm={handleDelete}
        okText="Да"
        okButtonProps={{style: {background: 'red'}}}
        cancelText="Нет"
      >
        <Button type="primary" icon={<DeleteOutlined />} danger />
      </Popconfirm> */}
    </div>
  );
});
