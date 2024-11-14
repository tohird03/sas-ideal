import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import {StorekeeperProduct} from '@/api/storekeeper/types';
import styles from '../storekeeperMain.scss';

const cn = classNames.bind(styles);

type Props = {
  provideImg?: string;
  providerName: string;
  providerPhone?: string;
};

export const StorekeeperProviderComp: FC<Props> = observer(({
  provideImg, providerName, providerPhone,
}) => (
  <>
    <div className={cn('storekeeperProductColumnWrapp')}>
      <div>
        <img
          // `${imgStages?.apiUrl}${provideImg}`
          src={'/User.png'} alt={'фотография поставщика'}
          className={cn('suplierImgColumn')}
        />
      </div>
      <div>
        <Typography.Title
          style={{margin: 0}}
          level={5}
        >{providerName}
        </Typography.Title>
        {/* <Typography.Text>{data.phone}</Typography.Text> */}
      </div>
    </div>
  </>
));
