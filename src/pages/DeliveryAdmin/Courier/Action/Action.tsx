import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {ICourier} from '@/api/courier/types';
import {courierStores} from '@/stores/dms';

type Props = {
  courier: ICourier;
};

export const Action: FC<Props> = observer(({courier}) => {
  const handleEditCourier = () => {
    courierStores.setSingleCourier(courier);
    courierStores.setIsOpenAddEditCourierModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditCourier} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
