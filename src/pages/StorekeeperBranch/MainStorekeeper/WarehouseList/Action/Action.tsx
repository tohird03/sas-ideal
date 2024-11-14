import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IWarehouses} from '@/api/wmsWarehouses/types';
import {ROUTES} from '@/constants';

type Props = {
  warehouse: IWarehouses;
};

export const Action: FC<Props> = observer(({warehouse}) => {
  const navigate = useNavigate();

  const handleReloadWarehouseMorePage = () => {
    navigate(ROUTES.mainStorekeeperWarehouseProducts.replace(':warehouseId', warehouse?.id));
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleReloadWarehouseMorePage} type="primary" icon={<MoreOutlined />} />
    </div>
  );
});
