import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {UploadOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IMainStorekeeperProductList} from '@/api/mainStorekeeper/types';
import {relatedProductsStore} from '@/stores/provider/related-products/related-products';

type Props = {
  product: IMainStorekeeperProductList;
};

export const Action: FC<Props> = observer(({product}) => {
  const handleStatusChange = () => {
    relatedProductsStore.setSingleCommonProduct(product);
    relatedProductsStore.setIsOpenProductUploadModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleStatusChange} type="primary" icon={<UploadOutlined />} />
    </div>
  );
});
