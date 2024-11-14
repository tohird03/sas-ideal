import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import {StorekeeperProduct} from '@/api/storekeeper/types';
import styles from '../storekeeperMain.scss';

const cn = classNames.bind(styles);

type Props = {
  images?: string;
  modelName: string;
  categoryName: string;
  directionName?: string;
};

export const StorekeeperProductColumnComp: FC<Props> = observer(({
  images, modelName, categoryName, directionName,
}) => (
  <>
    <div className={cn('storekeeperProductColumnWrapp')}>
      <div>
        <img
          src={images !== undefined ? `${imgStages?.apiUrl}${images}`
            : '/no-photo.png'} alt={modelName}
          className={cn('productImgColumn')}
        />
      </div>
      <div>
        <Typography.Title
          style={{margin: 0, textAlign: 'left'}}
          level={5}
        >{categoryName}
        </Typography.Title>
        <Typography.Text>{modelName} - {directionName || ''}</Typography.Text>
      </div>
    </div>
  </>
));
