import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import styles from './styleColumnComponets.scss';

const cn = classNames.bind(styles);

type Props = {
  tissueName: string;
  tissueColorName: string;
  tissueColor: string;
};

export const ReqProductTissueComp: FC<Props> = observer(
  ({tissueColor, tissueColorName, tissueName}) => (
    <>
      <div className={cn('reqProductTissueWrapp')}>
        <div>
          <Typography.Title style={{margin: 0, textAlign: 'left'}} level={5}>
            {tissueName}
          </Typography.Title>
          <Typography.Text>{tissueColorName}</Typography.Text>
        </div>
        <div
          className={cn('tissueColor')} style={{
            backgroundColor: tissueColor,
          }}
        />
      </div>
    </>
  )
);
