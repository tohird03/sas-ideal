import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import styles from './styleColumnComponets.scss';

const cn = classNames.bind(styles);

type Props = {
  name: string;
  phone: string;
};

export const RecipientComp: FC<Props> = observer(
  ({name, phone}) => (
    <>
      <div className={cn('recipientInfoWrapp')}>
        <Typography.Title style={{margin: 0, textAlign: 'left'}} level={5}>
          {name}
        </Typography.Title>
        <Typography.Text>
          {phone}
        </Typography.Text>
      </div>
    </>
  )
);
