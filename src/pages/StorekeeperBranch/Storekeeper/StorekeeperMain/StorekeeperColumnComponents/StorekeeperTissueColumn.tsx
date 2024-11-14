import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import {StorekeeperProduct} from '@/api/storekeeper/types';
import styles from '../storekeeperMain.scss';

const cn = classNames.bind(styles);

type Props = {
  tissueName: string;
  tissueColorName: string;
  tissueColor: string;
};

export const StorekeeperTissueColumn: FC<Props> = observer(({
  tissueName, tissueColor, tissueColorName,
}) => (
  <>
    <div className={cn('storekeeperTissueColumnWrapp')}>
      <div>
        <Typography.Title
          style={{margin: 0}} level={5}
        >{tissueName}
        </Typography.Title>
        <Typography.Text>{tissueColorName}</Typography.Text>
      </div>
      <div
        style={{backgroundColor: tissueColor}}
        className={cn('storekeeperTissueColor')}
      />
    </div>
  </>
));
