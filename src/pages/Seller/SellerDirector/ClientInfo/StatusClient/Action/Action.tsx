import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IClientStatus} from '@/api/seller/sellerClientStatus/types';
import {clientInfoStore} from '@/stores/seller';

type Props = {
  clientStatus: IClientStatus;
};

export const Action: FC<Props> = observer(({clientStatus}) => {

  const handleEditClientStatus = () => {
    clientInfoStore.setSingleClientStatus(clientStatus);
    clientInfoStore.setIsOpenAddEditClientStatusModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditClientStatus} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
