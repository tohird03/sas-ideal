import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IClientFrom} from '@/api/seller/sellerClientFrom/types';
import {clientInfoStore} from '@/stores/seller';

type Props = {
  clientFrom: IClientFrom;
};

export const Action: FC<Props> = observer(({clientFrom}) => {

  const handleEditDirection = () => {
    clientInfoStore.setSingleClientFrom(clientFrom);
    clientInfoStore.setIsOpenAddEditFromClientModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditDirection} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
