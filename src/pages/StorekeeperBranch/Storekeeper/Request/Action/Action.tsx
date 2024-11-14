import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EllipsisOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IRequestToWarehouse} from '@/api/storekeeper/types';
import {ROUTES} from '@/constants';
import {storekeeperRequestStore} from '@/stores/storekeeper';

type Props = {
  request: IRequestToWarehouse;
};

export const Action: FC<Props> = observer(({request}) => {
  const navigate = useNavigate();

  const handleReloadToSingleRequest = () => {
    storekeeperRequestStore.setSingleRequest(request);
    navigate(ROUTES.storekeeperSingleRequest.replace(':requestId', request?.id));
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleReloadToSingleRequest} type="primary" icon={<EllipsisOutlined />} />
    </div>
  );
});
