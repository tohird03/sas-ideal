import React from 'react';
import {observer} from 'mobx-react';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IClosedFlights} from '@/api/dmsRequest/types';
import {requestStore} from '@/stores/dms';

type Props = {
  moreInfo: IClosedFlights;
};

export const Action = observer(({moreInfo}: Props) => {

  const handleShowMoreInfo = () => {
    requestStore.setSingleClosedFlight(moreInfo);
    requestStore.setIsOpenClosedFlightInfoModal(true);
  };

  return (
    <Button
      icon={<ExclamationCircleOutlined />}
      onClick={handleShowMoreInfo}
      type="primary"
    />
  );
});
