import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IOpenRequest} from '@/api/dmsRequest/types';
import {requestStore} from '@/stores/dms';

type Props = {
  openRequest: IOpenRequest;
};

export const Action: FC<Props> = observer(({openRequest}) => {
  const handleOpenRequestInfo = () => {
    requestStore.setRequestId(openRequest?.id);
    requestStore.setIsOpenRequestInfoModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onClick={handleOpenRequestInfo}
        type="primary"
        icon={<MoreOutlined />}
      />
    </div>
  );
});
