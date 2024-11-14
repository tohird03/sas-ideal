import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {MoreOutlined} from '@ant-design/icons';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {IMyLogs} from '@/api/myLogs/types';
import {ROUTES} from '@/constants';
import {myLogsStore} from '@/stores/myLogs';

type Props = {
  myLogs: IMyLogs;
};

export const MyLogsAction: FC<Props> = observer(({myLogs}: Props) => {
  const navigate = useNavigate();

  const handleIdTask = () => {
    navigate(`/pms/workon/${myLogs?.id}`);
  };

  return (
    <div>
      <Button onClick={handleIdTask} icon={<MoreOutlined />} />
    </div>
  );
});
