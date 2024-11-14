import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import {imgStages} from '@/api/endpoints';
import styles from './styleColumnComponets.scss';

const cn = classNames.bind(styles);

type Props = {
  image: string;
  name: string;
  lastName: string;
  phone: string;
};

export const ApplicantComp: FC<Props> = observer(
  ({image, name, lastName, phone}) => (
    <>
      <div className={cn('applicantInfoWrapp')}>
        <div>
          <img
            src={image ? `${imgStages?.apiUrl}${image}` : '/User.png'}
            alt={'фотография поставщика'}
            className={cn('applicantImage')}
          />
        </div>
        <div>
          <Typography.Title style={{margin: 0}} level={5}>
            {name} {lastName}
          </Typography.Title>
          <Typography.Text>{phone}</Typography.Text>
        </div>
      </div>
    </>
  )
);
