import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import styles from './styleColumnComponets.scss';

const cn = classNames.bind(styles);

type Props = {
  images?: string;
  modelName: string;
  categoryName: string;
  directionName?: string;
  partId?: string;
};

export const ProductComp: FC<Props> = observer(
  ({images, partId, modelName, categoryName, directionName}) => (
    <>
      <div>
        <Typography.Title level={5} style={{textAlign: 'left'}}>
          {partId}
        </Typography.Title>

        <div className={cn('productCompWrapp')}>
          <img
            src={
              images !== undefined
                ? `${imgStages?.apiUrl}${images}`
                : '/no-photo.png'
            }
            alt={modelName}
            className={cn('productImages')}
          />
          <div className={cn('productText')}>
            <Typography.Text>{modelName}</Typography.Text>
            <br />
            <Typography.Text>
              {categoryName} {directionName && '-'} {directionName || ''}
            </Typography.Text>
          </div>
        </div>
      </div>
    </>
  )
);
