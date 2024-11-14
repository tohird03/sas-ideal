import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IDirection} from '@/api/direction/types';
import {pmDirectionStore} from '@/stores/productManager';

type Props = {
  direction: IDirection;
};

export const Action: FC<Props> = observer(({direction}) => {
  const handleEditDirection = () => {
    pmDirectionStore.setSingleDirection(direction);
    pmDirectionStore.setIsOpenAddEditDirectionModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditDirection} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
